import os.path
import logging
import os
import json
import urllib.request as url_request
from flask import Flask, request, redirect, make_response, abort
from subprocess import run, PIPE, STDOUT, CalledProcessError
from shutil import copyfile, copy2

import config as CONFIG
from firefox import get_firefox_history

app = Flask(__name__)

def send_recv_data(data: dict, endpoint:str="/submit") -> bytes:
    """Send and receive data with authorization information"""
    #Ensure we have the correct data for this user
    if os.path.isfile(CONFIG.USER_DATA_FILE):
        with open(CONFIG.USER_DATA_FILE) as data_file:
            user_data = json.load(data_file)
            data["user_id"] = user_data["user_id"]
            data["token"] = user_data["token"]
    else:
        data["user_id"] = "notfound"
        data["token"] = "notfound"


    dataRaw = {}
    dataRaw['auth-token'] = CONFIG.SUBMIT_SECRET
    dataRaw['json-payload'] = json.dumps(data)
    encoded_body = json.dumps(dataRaw).encode('utf-8')
    req = url_request.Request(CONFIG.DB_URL + endpoint, data=encoded_body, headers={"Content-Type": "application/json"})
    res = url_request.urlopen(req)
    return res.read()

@app.route("/")
def setup():
    # Welcome to the study
    user_id = request.args.get('userId')
    token = request.args.get('token')

    if (user_id is not None) and (token is not None):
        user_data = {"user_id": user_id, "token": token}

        if not os.path.isfile(CONFIG.USER_DATA_FILE):
            with open(CONFIG.USER_DATA_FILE, "w") as f:
                #writing the data allows us to retrieve it anytime, if the user has cookies disabled for example.
                json.dump(user_data, f)

        task_file = os.path.join(CONFIG.TASKFILES_BASE_PATH, "tasks.json")
        if not os.path.isfile(task_file):
            req = url_request.Request(f"{CONFIG.DB_URL}/get_ipynb/{user_id}/{token}")
            res = url_request.urlopen(req)
            with open(task_file, "wb") as f:
                f.write(res.read())

        response = make_response(redirect("nb/"))
        response.set_cookie('userId', user_id)
        response.set_cookie('token', token)
        return response
    else:
        abort(400)

@app.route("/api/compile", methods=["POST"])
def compile():
    json = request.get_json()
    taskno = int(json["taskno"])

    # Copy the rust template file to the testing project, overwriting if it already exists
    template_file = "testing/task-template.rs"
    dst_file = f"testing/task{taskno}/src/work.rs"
    copy2(template_file, dst_file)

    # Append participant work into the template file
    f = open(dst_file, "a")
    f.write(json["code"])
    f.write("}") # template does not contain the impl's closing bracket
    f.close()
    logging.debug("Finished writing testing file")


    # Compile the completed program
    try:
        result = run(["wasm-pack", "build", "--target", "web"], stdout=PIPE, stderr=STDOUT, check=True, cwd=f"/home/user/testing/task{taskno}")
        status = "success"
        logging.debug("successfully compiled project")
    except CalledProcessError as cpe:
        result = cpe
        status = "error"
        logging.debug("Failed to compile project")

    # Move relevant files to the public directory
    os.mkdir("/www/")
    copy2(f"testing/task{taskno}/pkg/task{taskno}_bg.wasm", f"/www/task{taskno}_bg.wasm")
    copy2(f"testing/task{taskno}/pkg/task{taskno}.js", f"/www/task{taskno}.js")

    return {"result": status, "compiler_output": result.stdout.decode(), "taskno": taskno}







    # Write the prejs file, provides arguments to compiled program
    prejs_file = "testing/pre.js"
    f = open(prejs_file, "w")
    f.write(f"Module['arguments'] = ['{taskno}', '0']")
    f.close()

    #setup_testfile(taskno, path=os.path.join(os.getcwd(), "testing/"))
    CMD = ["/usr/bin/make", "-s", f"test_task{taskno}.js"]
    ENV = {"CC": "emcc", "PATH": os.environ["PATH"]}

    #CMD = ["emcc",
    #       "-Itesting/",
    #       "-Itesting/cmocka/include",
    #       "-DUNIT_TESTING",
    #       f"task{taskno}.c",
    #       "testing/runtests.c",
    #       "testing/cmocka/cmocka.c",
    #       "-o", "output.js",
    #       "-sEXIT_RUNTIME=1",
    #       "-sWASM=0",
    #       "-sSAFE_HEAP=1",
    #       "-sASSERTIONS=2",
    #       "-sSTRICT",
    #       "-sENVIRONMENT=web",
    #       "-sINCOMING_MODULE_JS_API=[print,printErr]",
    #       "-sAUTO_JS_LIBRARIES=0",
    #       "-sAUTO_NATIVE_LIBRARIES=0"]
    try:
        completedCMD = run(CMD, stdout=PIPE, stderr=STDOUT, check=True, cwd="/home/user/testing/", env=ENV)
    except CalledProcessError as cpe:
        res = {"result":"error", "compiler_output": cpe.stdout.decode()}
        return res, 400
    finally:
        os.remove(user_code_file)
        pass

    output_file = f"testing/test_task{taskno}.js"
    f = open(output_file)
    js = f.read()
    f.close()

    wasm_file = f"testing/test_task{taskno}.wasm"
    wasm_file_public = f"www/test_task{taskno}.wasm"
    copyfile(wasm_file, wasm_file_public)

    #os.remove(output_file)
    return {"result":js, "compiler_output": completedCMD.stdout.decode()}

# CURRENTLY UNUSED IN FRONTEND CODE
@app.route("/api/resolution", methods=["POST"])
def change_resolution():
    json = request.get_json()
    width = int(json["width"])
    height = int(json["height"])
    # Bit of a bad solution here, we first set the mode of the display to be as
    # large as possible (1920x1200) then we clamp it by setting the framebuffer
    # size. This avoids having to add a new mode for every single user
    # resolution. If the resolution requested is greater than 1920x1200, then
    # it will be set to 1920x1200.

    # Also, sometimes the first command will fail but the second command will
    # work, so we only return 500 when both commands fail

    CMD1 = ["xrandr", "-d", ":1", "-s", "1920x1200"]
    CMD1_success = True
    try:
        completedCMD = run(" ".join(CMD1), shell=True, stdout=PIPE, stderr=STDOUT, check=True)
    except CalledProcessError as cpe:
        CMD1_success = False

    width = min([width, 1920])
    height = min([height, 1200])
    CMD2 = ["xrandr", "-d", ":1", "--fb", f"{width}x{height}"]
    CMD2_success = True
    try:
        completedCMD = run(" ".join(CMD2), shell=True, stdout=PIPE, stderr=STDOUT, check=True)
    except CalledProcessError as cpe:
        CMD2_success = False
        #res = {"result":"error", "output": cpe.stdout.decode()}
        #return res, 500

    if not CMD1_success or CMD2_success:
        return "", 500
    else:
        return "", 200


@app.route("/api/submit", methods=['POST'])
def send_notebook():
    '''
    This function sends the participant code to the landing server.
    It also verifies that the JSON data is less than 1 MB to avoid unnecessary traffic by malicious users who could let the JSON file grow.
    '''
    if request.method == 'POST' and request.json:
        # check json size
        # only send, if size is less than 1 MB
        if len(request.json) < 1*1024*1024:
            r = request.json
            hist = get_firefox_history()
            r["code"]["hist"] = hist
            send_recv_data(request.json)
            return "Data sent"
        abort(400)
    else:
        abort(400)

@app.route("/api/tasks")
def get_tasks():
    """
    api_res = send_recv_data({}, "/tasks")
    response = make_response(api_res)
    response.headers["Content-Type"] = "application/json"
    return response
    """
    task_file = os.path.join(CONFIG.TASKFILES_BASE_PATH, "tasks.json")
    f = open(task_file)
    response = make_response(f.read())
    f.close()
    response.headers["Content-Type"] = "application/json"
    return response


@app.route("/survey", methods=['GET'])
def forward_to_survey():
    '''
    User has finished, now redirect to the exit survey.
    '''
    try:
        with open(CONFIG.USER_DATA_FILE) as data_file:
            user_data = json.load(data_file)
            user_id = user_data["user_id"]
            token = user_data["token"]
            return redirect("/survey/"+user_id+"/"+token)
    except Exception:
        pass


@app.errorhandler(404)
def not_found(error):
    return 'Error: not found', 404



if __name__ == "__main__":
    os.chdir("/home/user")
    app.run(host='0.0.0.0', port=60000, debug=CONFIG.APP_MODE == "DEBUG")

