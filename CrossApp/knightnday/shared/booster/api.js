var LATEST_VERSION = "v3.3.4"; /* put in a separate bm-version that can be updated by php */

var _api_version;
var require = {skipDataMain: true};

var load_script = function () {
  var lib_name = "booster-api";

  var script = document.getElementById("booster-api");
  var version = script.getAttribute("data-version");
  var module = script.getAttribute("data-module");
  if (version != undefined) _api_version = version;
  if (module != undefined) lib_name = module;

  if (_api_version == undefined) _api_version = LATEST_VERSION;

  window.bb_base_path = "./shared/booster/" + _api_version;

  var js_script_path = "./shared/booster/" + _api_version + "/js/" + lib_name + ".js";
  var css_script_path = "./shared/booster/" + _api_version + "/css/" + lib_name + ".css";

  var script = document.createElement('script'); 
  script.type = 'text/javascript'; 
  script.async = true;
  script.src = js_script_path;
  var s = document.getElementsByTagName('script')[0]; 
  s.parentNode.insertBefore(script, s);

  var ss = document.createElement("link");
  ss.type = "text/css";
  ss.rel = "stylesheet";
  ss.href = css_script_path;
  document.getElementsByTagName("head")[0].appendChild(ss);
}

load_script();
