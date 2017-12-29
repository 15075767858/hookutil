//var windowsapi = require("../build/Release/windowsapi.node");

console.log(windowsapi.hello())
var hwnd = windowsapi.getWindowHwnd("FTGMOS.exe");
console.log(hwnd);

var start = new Date().getTime()
var lpBaseAddress = 0x070F9410;
var res;
for (var i = 0; i < 10000; i++) {
    var nSize = 8;
    res = windowsapi.readProcessMemory(hwnd, lpBaseAddress += 4, nSize)
    console.log(res);
}
console.log("time = ", new Date().getTime() - start);
