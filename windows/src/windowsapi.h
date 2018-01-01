#include <iostream>
#include <windows.h>
#include <tchar.h>
#include <stdio.h>
#include <TlHelp32.h>
#include <psapi.h>
namespace windows
{
BOOL CALLBACK MyEnumProc(HWND hWnd, LPARAM lParam);
HWND GetProcessMainWnd(DWORD dwProcessId);
HWND GetWndHwnd(const char *strExeName);
LPVOID MyReadProcessMemory(int hWnd,int point,SIZE_T nSize);
HMODULE GetModulesBasePoint(DWORD processID, char * modelName);
}