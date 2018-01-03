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
DWORD hPid = 0;
void Method(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    //hello=arg0;
    v8::String::Utf8Value Utf8Value(args[0]);

    hello = Utf8Value.operator*();
    printf(hello);
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
    LPVOID eax = 0;
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
    v8::String::Utf8Value Utf8Value(args[0]);
    HWND hWnd = windows::GetWndHwnd(Utf8Value.operator*());
    //printf(" %d %d %d \n ",hWnd,hWnd1,hWnd2);
    args.GetReturnValue().Set((long)hWnd);
}
// void GetWindowRect(const FunctionCallbackInfo<Value> &args)
// {
//     Isolate *isolate = args.GetIsolate();
//     RECT rect;
//     Local<Number> args0 = NULL;
//     if (args[0]->IsNull())
//     {
//         GetWindowRect(hwnd2, &rect);
//     }
// }
void MySetWindowTextA(const FunctionCallbackInfo<Value> &args)
{
    Local<Number> arg0 = args[0]->ToNumber();
    HWND hWnd = (HWND)(long)arg0->Value();
    Local<String> arg1 = args[1]->ToString();
    v8::String::Utf8Value Utf8Value(arg1);
    char *str = Utf8Value.operator*();
    printf(str);
    args.GetReturnValue().Set(SetWindowTextA(hWnd, str));
}

void MyGetWindowTextA(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    Local<Number> arg0 = args[0]->ToNumber();
    HWND hWnd = (HWND)(long)arg0->Value();
    //Local<String> arg1 = args[1]->ToString();
    //v8::String::Utf8Value Utf8Value(arg1);
    //char *str = Utf8Value.operator*();
    const int size = 100;
    char str[size];
    GetWindowTextA(hWnd, str, sizeof(str));
    Local<Array> arr = Array::New(isolate, size);
    printf(&str[0]);
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, &str[0]));
}
void MyGetWindowRect(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    Local<Number> arg0 = args[0]->ToNumber();
    HWND hWnd = (HWND)(long)arg0->Value();
    RECT rect;
    GetWindowRect(hWnd, &rect);
    Local<Object> obj = Object::New(isolate);
    obj->Set(String::NewFromUtf8(isolate, "x"), Number::New(isolate, rect.left));
    obj->Set(String::NewFromUtf8(isolate, "y"), Number::New(isolate, rect.top));
    obj->Set(String::NewFromUtf8(isolate, "width"), Number::New(isolate, rect.right - rect.left));
    obj->Set(String::NewFromUtf8(isolate, "height"), Number::New(isolate, rect.bottom - rect.top));
    args.GetReturnValue().Set(obj);
}
void GetRealWndHwnd(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    Local<Number> arg0 = args[0]->ToNumber();
    HWND hWnd = (HWND)(long)arg0->Value();
    char str[20];
    GetWindowTextA(hWnd, str, sizeof(str));
    HWND hWnd1 = FindWindowExA(NULL, NULL, NULL, &str[0]);
    HWND hWnd2 = FindWindowExA(hWnd1, NULL, "FTGMOSClass", NULL);
    args.GetReturnValue().Set((long)hWnd2);
}
void getWndPid(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    Local<Number> arg0 = args[0]->ToNumber();
    int hWnd = (int)arg0->Value();
    LPDWORD hProcId = (LPDWORD)malloc(sizeof(LPDWORD));
    GetWindowThreadProcessId((HWND)hWnd, hProcId);
    hProcess = OpenProcess(PROCESS_ALL_ACCESS, 0, *hProcId);
    hPid = *hProcId;

    //count = hProcess;

    //LPVOID eax;
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
                Local<Value> argv[argc] = {Number::New(isolate, startAddr + i)};
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
void GetModelHandle(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    Local<String> arg0 = args[0]->ToString();
    v8::String::Utf8Value Utf8Value(args[0]);
    HMODULE point = windows::GetModulesBasePoint((DWORD)hPid, Utf8Value.operator*());
    //char *modelName = arg0->Value();
    args.GetReturnValue().Set((int)point);
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
void MySetCursorPos(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    Local<Number> arg0 = args[0]->ToNumber();
    Local<Number> arg1 = args[1]->ToNumber();
    int X = arg0->Value();
    int Y = arg1->Value();
    args.GetReturnValue().Set(SetCursorPos(X, Y));
}
void MouseRClick(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    mouse_event(MOUSEEVENTF_XDOWN, 0, 0, 0, 0);
     Sleep(20);
    mouse_event(MOUSEEVENTF_XUP, 0, 0, 0, 0);
    args.GetReturnValue().Set(0);
}
void init(Local<Object> exports)
{
    NODE_SET_METHOD(exports, "input", Method);
    NODE_SET_METHOD(exports, "output", Method1);
    NODE_SET_METHOD(exports, "RunCallback", RunCallback);
    NODE_SET_METHOD(exports, "getWindowHwnd", GetWndHwnd);
    NODE_SET_METHOD(exports, "GetRealWndHwnd", GetRealWndHwnd);
    NODE_SET_METHOD(exports, "GetWindowRect", MyGetWindowRect);
    NODE_SET_METHOD(exports, "GetWindowTextA", MyGetWindowTextA);
    NODE_SET_METHOD(exports, "SetWindowTextA", MySetWindowTextA);
    NODE_SET_METHOD(exports, "SetCursorPos", MySetCursorPos);
    NODE_SET_METHOD(exports, "getWndPid", getWndPid);
    NODE_SET_METHOD(exports, "readProcessMemory", MyReadProcessMemory);
    NODE_SET_METHOD(exports, "SearchInt", SearchInt);
    NODE_SET_METHOD(exports, "GetModelHandle", GetModelHandle);
    NODE_SET_METHOD(exports, "GetWindowTextA", MyGetWindowTextA);
    NODE_SET_METHOD(exports, "MouseRClick", MouseRClick);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, init)

} // namespace demo
