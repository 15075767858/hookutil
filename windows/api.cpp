#include <node.h>
//#include "build"
#include "src/windowsapi.h"
namespace demo
{
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;
void Method(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "world"));
}
void GetWndHwnd(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    Local<String> arg0 = args[0]->ToString();
    //char * t= String::ToCString(arg0);
    v8::String::Utf8Value Utf8Value(args[0]);
    //const char* a =  v8::String::Utf8Value operator*( args[0]);
    //v8::String::Utf8Value str(args.GetIsolate(), args[i]);
    HWND hWnd = windows::GetWndHwnd(Utf8Value.operator*());
    //HWND hWnd = windows::GetWndHwnd("FTGMOS.exe");
    args.GetReturnValue().Set((long)hWnd);
}
void ReadProcessMemory(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    Local<Number> hwnd = args[0]->ToNumber();
    Local<Number> lpBaseAddress = args[1]->ToNumber();
    Local<Number> nSize = args[2]->ToNumber();
    LPVOID eax = windows::MyReadProcessMemory((int)hwnd->Value(), lpBaseAddress->Value(), nSize->Value());
    args.GetReturnValue().Set((int)eax);
}

void init(Local<Object> exports)
{
    NODE_SET_METHOD(exports, "hello1", Method);
    NODE_SET_METHOD(exports, "getWindowHwnd", GetWndHwnd);
    NODE_SET_METHOD(exports, "readProcessMemory", ReadProcessMemory);
}
NODE_MODULE(NODE_GYP_MODULE_NAME, init)

} // namespace demo
