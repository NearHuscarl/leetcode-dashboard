export async function ankiConnect(action: string, params = {}, version = 6) {
  const r = await fetch("http://127.0.0.1:8765", {
    method: "POST",
    body: JSON.stringify({ action, version, params }),
  });
  const response = await r.json();

  if (Object.getOwnPropertyNames(response).length != 2) {
    throw "response has an unexpected number of fields";
  }
  if (!response.hasOwnProperty("error")) {
    throw "response is missing required error field";
  }
  if (!response.hasOwnProperty("result")) {
    throw "response is missing required result field";
  }
  if (response.error) {
    throw response.error;
  }
  return response.result;
}
