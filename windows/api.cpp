#include <node.h>
//#include "build"
#include "src/windowsapi.h"
namespace demo
{
using v8::Array;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::Integer;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;
char *hello = "hello";
int count = 0;
HANDLE hProcess = 0;

void Method(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    //hello=arg0;
    v8::String::Utf8Value Utf8Value(args[0]);
    hello = Utf8Value.operator*();
    count++;
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, hello));
}
void Method1(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    Local<Array> a = Array::New(isolate, 10);
    a->Set(Integer::New(isolate, 1), Integer::New(isolate, 12));
    a->Set(Integer::New(isolate, 2), String::NewFromUtf8(isolate, "aaa"));
    DWORD point = 0x7FFFF3FF;
    LPVOID eax;
    while (point < 0x7FFFFFFF)
    {
        ReadProcessMemory(hProcess, LPCVOID(point), eax, 4, 0);
        point += 4;
    }
    args.GetReturnValue().Set((int)point);
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
void getWndPid(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    Local<Number> arg0 = args[0]->ToNumber();
    int hWnd = (int)arg0->Value();
    LPDWORD hProcId = (LPDWORD)malloc(sizeof(LPDWORD));
    GetWindowThreadProcessId((HWND)hWnd, hProcId);
    hProcess = OpenProcess(PROCESS_ALL_ACCESS, 0, *hProcId);
    //count = hProcess;

    LPVOID eax;
    free(hProcId);
    args.GetReturnValue().Set((int)hProcess);
}
void SearchInt(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    Local<Number> searchNum = args[1]->ToNumber();
    DWORD num = searchNum->Value();
    DWORD startAddr = args[2]->ToNumber()->Value();
    DWORD endAddr = args[3]->ToNumber()->Value();
    Local<Function> cb = Local<Function>::Cast(args[4]);
    if (!startAddr || startAddr < 0x400000)
    {
        startAddr = 0x400000;
    }
    if (!endAddr || endAddr > 0x7FFF0000 || endAddr < startAddr)
    {
        endAddr = 0x7FFF0000;
    }
    MEMORY_BASIC_INFORMATION mbi;
    DWORD value;
    while (startAddr < endAddr)
    {
        VirtualQueryEx(hProcess, (LPCVOID)startAddr, &mbi, sizeof(mbi));
        byte *buf = (byte *)malloc(mbi.RegionSize);
        ReadProcessMemory(hProcess, (LPCVOID)startAddr, buf, mbi.RegionSize, 0);
        for (int i = 0; i < mbi.RegionSize; i += 4)
        {
            value = *(UINT *)&buf[i];
            if (value == num)
            {
                const unsigned argc = 1;
                Local<Value> argv[argc] = {Number::New(isolate,startAddr + i)};
                cb->Call(Null(isolate), argc, argv);
            }
        }
        startAddr += mbi.RegionSize;
        delete buf;
    }
}
void MyReadProcessMemory(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    Local<Number> lpBaseAddress = args[1]->ToNumber();
    Local<Number> arg2 = args[2]->ToNumber();
    int nSize = arg2->Value();
    int point = (int)lpBaseAddress->Value();
    byte *eax = (byte *)malloc(nSize);
    //LPVOID eax = windows::MyReadProcessMemory((int)hwnd->Value(), lpBaseAddress->Value(), nSize->Value());
    //LPVOID eax;
    Local<Array> res = Array::New(isolate, nSize);
    ReadProcessMemory(hProcess, LPCVOID(point), eax, nSize, 0);
    for (int i = 0; i < nSize; i++)
    {
        res->Set(Integer::New(isolate, i), Integer::New(isolate, eax[i]));
    }
    args.GetReturnValue().Set(res);
    delete eax;
}
void RunCallback(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    Local<Function> cb = Local<Function>::Cast(args[0]);
    const unsigned argc = 1;
    Local<Value> argv[argc] = {String::NewFromUtf8(isolate, "hello world")};
    cb->Call(Null(isolate), argc, argv);
    cb->Call(Null(isolate), argc, argv);
    cb->Call(Null(isolate), argc, argv);
}
void init(Local<Object> exports)
{
    NODE_SET_METHOD(exports, "input", Method);
    NODE_SET_METHOD(exports, "output", Method1);
    NODE_SET_METHOD(exports, "RunCallback", RunCallback);
    NODE_SET_METHOD(exports, "getWindowHwnd", GetWndHwnd);
    NODE_SET_METHOD(exports, "getWndPid", getWndPid);
    NODE_SET_METHOD(exports, "readProcessMemory", MyReadProcessMemory);
    NODE_SET_METHOD(exports, "SearchInt", SearchInt);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, init)

} // namespace demo
