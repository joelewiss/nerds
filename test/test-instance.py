import urllib.request as request
from urllib.error import HTTPError
import json

TEST_CODE = """
int list_update_item_at_pos(node **head, char *item_name, float price, int quantity, unsigned int pos) {
  if (head == NULL || item_name == NULL || item_name[0] == '\0' || quantity <= 0) {
    return EXIT_FAILURE;
  }
  node *curr = *head;
  int i = 1;
  for (i = 1; i < pos; i++) {
    if (curr->next == NULL) {
      return EXIT_FAILURE;
    }
    curr = curr->next;
  }
  free(curr->item_name);
  curr->item_name = (char *)malloc(sizeof(char) * (strlen(item_name) + 1));
  strcpy(curr->item_name, item_name);
  curr->price = price;
  curr->quantity = quantity;
  return EXIT_SUCCESS;
}"""
TEST_CODE_TASKNO = 2

def format_json(j:str):
    return json.dumps(json.loads(j), indent=4)


if __name__ == "__main__":
    API_HOST = "localhost"
    API_PORT = 81

    r_data = {"code": TEST_CODE, "taskno": TEST_CODE_TASKNO}
    r = request.Request(
            f"http://{API_HOST}:{API_PORT}/api/compile",
            data=json.dumps(r_data).encode(),
            headers = {"Content-Type": "application/json"},
            method = "POST")
    try:
        res = request.urlopen(r)
        print(res.status)
        print("Response:")
        print(res.read())
    except HTTPError as e:
        print(e.status)
        print("Response:")
        if e.headers["Content-Type"] == "application/json":
            res = json.loads(e.read())
            print("Result:", res["result"])
            print("Compiler output:", res["compiler_output"])
        else:
            print(e.read())

