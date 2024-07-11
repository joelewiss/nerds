import {DEV_MODE, BACKEND_PRESENT} from "./util";

let API_BASE_PATH = "../api";
if (DEV_MODE) {
  API_BASE_PATH = "http://192.168.1.35:60000/api";
}
//const DEV_MODE = process.env.NODE_ENV === "development";
//const DEV_MODE = true;

function compile(data) {
  if (BACKEND_PRESENT) {
    return fetch(`${API_BASE_PATH}/compile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then((res) => {
      return res.json();
    });
  } else {
    return new Promise((resolve) => resolve({
      "result":"", // Basically a noop
      "compiler_output": "DEV MODE TEST OUTPUT\nTHIS SHOULD NEVER BE SEEN IN PRODUCTION"
    }));
  }
}


function submit(nb_data) {
  // Submit the JSON object given by nb_data to the server
  if (BACKEND_PRESENT) {
    fetch(`${API_BASE_PATH}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nb_data)
    }).catch(reason => {
      console.debug(`Submit error: ${reason}`);
    });
  } else {
    console.debug("Submitting data:");
    console.debug(nb_data);
  }
}


function get_tasks() {
  /* get_tasks: Get a list of tasks from the server
   * Returns a promise that resolves with task data*/

  /* Task format:
   * [
   *    {
   *      "suggestions": ["...", "...", ...]
   *      "desc": "..."
   *    }
   * ]
   */

  if (BACKEND_PRESENT) {
    return fetch(`${API_BASE_PATH}/tasks`).then((res) => {
      return res.json();
    });
  } else {
    console.debug("Sending debug response to get_tasks call");
    return new Promise((resolve) => resolve({
      "randomize_suggestions": true,
      "tasks": [
        {
          "suggestions": [],
          "fixed": true,
          "desc": "<h2>Welcome!</h2><p>Welcome to the study. You will be selecting and editing AI generated code suggestions to complete an implementation of a shopping list using a linked list. Each item in the list has an item name, price, and quantity. The list is created using a <code>list_init</code> function which takes a double pointer and initializes it to <code>NULL</code>. Since you are emulating a shipping list, <em>indexing starts at 1 instead of zero</em>. Please only alter the code within the body of the function and do not alter the function header. Additionally, you may use any outside resources, but please only use the browser tab we provide for you.",
          "task_no": 0
        },
        {
          "suggestions": [
            "int list_remove_item_at_pos(node **head, int pos) {\n\tif(head == NULL) {\n\t\treturn EXIT_FAILURE;\n\t}\n\n\tif(pos == 0) {\n\t\treturn EXIT_FAILURE;\n\t}\n\n\tnode *temp = *head;\n\tif(pos == 1) {\n\t\tif(*head == NULL) {\n\t\t\treturn EXIT_FAILURE;\n\t\t}\n\t\telse {\n\t\t\t*head = temp->next;\n\t\t\tfree(temp->item_name);\n\t\t\tfree(temp);\n\t\t\treturn EXIT_SUCCESS;\n\t\t}\n\t}\n\n\tint index = 1;\n\twhile(temp->next!= NULL && index < pos - 1) {\n\t\ttemp = temp->next;\n\t\tindex++;\n\t}\n\n\tif(index == pos - 1) {\n\t\tif(temp->next == NULL) {\n\t\t\treturn EXIT_FAILURE;\n\t\t}\n\t\telse {\n\t\t\tnode *temp2 = temp->next;\n\t\t\ttemp->next = temp->next->next;\n\t\t\tfree(temp2->item_name);\n\t\t\tfree(temp2);\n\t\t\treturn EXIT_SUCCESS;\n\t\t}\n\t}\n\telse {\n\t\treturn EXIT_FAILURE;\n\t}\n}",
            "int list_remove_item_at_pos(node **head, int pos) {\n  // Check if pos is 0\n  if (pos == 0) {\n    return EXIT_FAILURE;\n  }\n\n  // Else pos is not 0\n  else {\n    // Check if pos is 1\n    if (pos == 1) {\n      node *temp;\n      temp = *head;\n      *head = (*head)->next;\n      free(temp);\n      return EXIT_SUCCESS;\n    }\n    // Else pos is not 1\n    else {\n      // Call list_remove_item_at_pos on head->next and remove the result\n      list_remove_item_at_pos(&((*head)->next), pos - 1);\n      return EXIT_SUCCESS;\n    }\n  }\n}",
            "int list_remove_item_at_pos(node **head, int pos) {\n    if (*head == NULL || pos == 0) {\n        return EXIT_FAILURE;\n    }\n    int cur_pos = 1;\n    node *cur = *head;\n    while (cur->next && cur_pos < pos-1) {\n        cur = cur->next;\n        cur_pos++;\n    }\n    if (cur_pos == pos-1) {\n        node *temp = cur->next;\n        cur->next = cur->next->next;\n        free(temp->item_name);\n        free(temp);\n    } else {\n        return EXIT_FAILURE;\n    }\n    return EXIT_SUCCESS;\n}",
            "int list_remove_item_at_pos(node **head, int pos) {\n  int i;\n  node *curr = *head;\n  node *prev = NULL;\n  for (i = 0; i < pos; i++) {\n    if (curr == NULL) {\n      return EXIT_FAILURE;\n    }\n    prev = curr;\n    curr = curr->next;\n  }\n  if (prev == NULL) {\n    *head = curr->next;\n  } else {\n    prev->next = curr->next;\n  }\n  free(curr);\n  return EXIT_SUCCESS;\n}",
            "int list_remove_item_at_pos(node **head, int pos) {\n    int result = EXIT_SUCCESS;\n    node *prev = NULL;\n    node *current = *head;\n    int i = 0;\n\n    if (pos == 0) {\n        *head = current->next;\n    } else {\n        while (i < pos) {\n            prev = current;\n            current = current->next;\n            i++;\n        }\n\n        prev->next = current->next;\n    }\n\n    free(current);\n\n    return result;\n}"
          ],
          "desc": "<h1 id=\"remove-item\">Remove item</h1>\n<p>In this task, you will be required to select and edit an AI generated code snippet to perform the following function: remove an item from the list at the given index. You may assume that the head node has been initialized to <code>NULL</code> and that indexing starts at 1. Please do not alter the function header.</p><p>Task:</p>\n<ul>\n<li>remove an item from the list at the given index</li>\n</ul>\n<p>Assumptions:</p>\n<ul>\n<li>the head node has been initialized to NULL</li>\n<li>indexing starts at 1</li>\n</ul>\n<p>Requirements:</p>\n<ul>\n<li>Please do not alter the function header</li>\n</ul>\n<p>Commands:</p>\n<ul>\n<li><p>Tab key or next suggestion button: see next suggestion</p></li>\n<li><p>Shift+Tab keys: back to previous suggestion</p></li>\n<li><p>Pick button: select a snippet</p></li>\n<li><p>Run button: test code</p></li>\n<li><p>Go back to snippets from editing code: red back button</p></li>\n</ul>",
          "task_no": 3
        },
        {
          "suggestions": [
            `print "Hello World"\nexit(0)\n`,
            `#include<stdio.h>\n\nint main() {\n    puts("Hello World 2!");\n}`
          ],
          "desc": `Second task description\nWelcome to the first task, please `+
          `select a code snippet and click "Pick" to start editing`,
          "task_no": 2
        },
        {
          "suggestions": [
            `print "Hello World"\nexit(0)\n`,
            `#include<stdio.h>\n\nint main() {\n    puts("Hello World!");\n}`
          ],
          "desc": `<p>First task description</p>Welcome to the first task, please `+
          `select a code snippet and click "Pick" to start editing`,
          "task_no": 1
        },
      ]
    }));
  }
}

function set_resolution(width, height) {
  return fetch(`${API_BASE_PATH}/resolution`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({"width": width, "height": height})
  });
}


export {submit, get_tasks, set_resolution, compile}
