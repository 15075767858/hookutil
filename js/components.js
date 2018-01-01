Ext.define("MainPanel", {
    xtype: "MainPanel",
    extend: "Ext.panel.Panel",
    defaults: {
        closable: true,
    },
    controller: {
        ByteCompare: function () {
            var me = this.view;
            me.add(Ext.create("ByteCompare", {
            }))
        },
        DrawPanel: function () {
            var me = this.view;
            me.add(Ext.create("DrawPanel", {
            }))
        },

        MemoryUtil: function () {
            var me = this.view;
            me.add(Ext.create("MemoryUtilPanel", {
            }))
        },
        loginPanel: function (button) {
            var me = this.view;
            var login = null;
            if (button.value == 1) {
                login = Ext.create("fentengLoginPanel",
                    {
                        width: 500,
                        viewModel: {
                            data: {
                                ftvalid: "",
                                userid: "a5461789",
                                password: "a5461789",
                                sign: "65ddeb30ff3f741d79d5879ce6fa86e4",
                                name: "阿德啊"
                            }
                        }
                    }
                )

            } else if (button.value == 2) {

                login = Ext.create("fentengLoginPanel",
                    {
                        viewModel: {
                            data: {
                                ftvalid: "",
                                userid: "b5461789",
                                password: "b5461789",
                                sign: "cb8b45415e67989586b1e0f30264c120",
                                name: "阿德呃呃"
                            }
                        }
                    }
                )

            } else if (button.value == 3) {

                login = Ext.create("fentengLoginPanel",
                    {
                        viewModel: {
                            data: {
                                ftvalid: "",
                                userid: "c5461789",
                                password: "c5461789",
                                sign: "8471ce01816bcabef4db29888f4d05b6",
                                name: "爱迪生2"
                            }
                        }
                    }
                )

            } else if (button.value == 4) {
                login = Ext.create("fentengLoginPanel",
                    {
                        viewModel: {
                            data: {
                                ftvalid: "",
                                userid: "d5461789",
                                password: "d5461789",
                                sign: "56e03fff63804d868b57a476e0c9701a",
                                name: '爱爱你们'
                            }
                        }
                    }
                )
            } else {

            }
            me.add(login)
        }

    },
    tbar: [
        {
            text: '阿德啊', value: 1, handler: "loginPanel"
        },
        {
            text: "Memory Util", handler: "MemoryUtil"
        },
        {
            text: "Byte Compare", handler: "ByteCompare"
        }, {
            text: "login",
            menu: [
                {
                    text: '阿德呃呃', value: 2, handler: "loginPanel"
                }, {
                    text: '新手区网通', value: 3, handler: "loginPanel"
                }, {
                    text: '新手区电信', value: 4, handler: "loginPanel"
                }
            ]
        },
        {
            text: "Draw Panel", handler: "DrawPanel"
        }

    ]
})
    
Ext.define("DrawPanel", {
    extend: "Ext.container.Container",
    layout: 'absolute',
    xtype: "DrawPanel",
    header: false,
    initComponent: function () {
        var me = this;
        me.minification = 11;
        me.width = 3300 / me.minification;
        me.height = 3300 / me.minification;

        me.addObj = function (basePoint) {
            let item = me.down("#" + basePoint)
            let arr = windowsapi.readProcessMemory(null, basePoint, 0x62)
            let buf = Buffer.from(arr);
            var gwtype = buf.readInt8(0x2e)
            //if (type != 38) {
            //    return;
            //}
            var x = buf.readInt32LE(0x58);
            var y = buf.readInt32LE(0x5C);
            if (gwtype <= 0) {
                return;
            }
            console.log(Number(basePoint).toString(16), gwtype, x, y)

            if (x < 800 & y < 800) {
                //return;
            }
            if (item) {
                item.setPosition(x / me.minification, y / me.minification);
                item.data = `basePoint=${basePoint} x = ${x} y = ${y} \n` + arr.join(" ")
            } else {
                item = Ext.create("Ext.panel.Panel", {
                    width: 70 / me.minification,
                    height: 70 / me.minification,
                    x: x / me.minification,
                    y: y / me.minification,
                    bodyStyle: {
                        //background: 'red',
                    },
                    listeners: {
                        el: {
                            mouseover: function () {
                                console.log(item.data)
                            }
                        }
                    }
                })
                item.data = `basePoint=${basePoint} x = ${x} y = ${y} \n` + arr.join(" ")
                me.add(item)
            }


        }

        me.callParent();
    }
})

Ext.define("ByteCompare", {
    extend: "Ext.panel.Panel",
    xtype: "MemoryUtilPanel",
    border: true,
    defaults: {
        closable: true,
    },
    title: "Byte Compare Util",
    viewModel: {
        data: {
            basePoint: "12345",
            searchvalue: "nengine.dll+EF8DC",
            readLengh: 20,
            describe: "describe",
            bytes: "DC EF CC 04 D8 F1 8C 04 15 28 00 00 00 00 00 00 90 A8 8D 07 95 5C 26 73 5A 0C 41 14 98 2E 0D 18 28 B0 8E 07 03 00 04 00 01 00 07 00 02 00 08 00 00 00 03 DE 01 00 00 00 E9 FF FF FF DB FF FF FF 20 00 00 00 04 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 99 02 00 00 D9 08 00 00"
        }
    },
    controller: {
        generateBytePanel: function () {
            var me = this.view;
            var viewModel = this.view.viewModel;
            var describe = viewModel.get("describe")
            var bytes = viewModel.get("bytes")
            var basePoint = viewModel.get("basePoint")
            var bytesPanel = Ext.create("BytePanel", {
                basePoint: basePoint,
                title: describe
            }).generateByte(bytes);
            console.log(me);
            me.add(bytesPanel);
        },

        Compare: function () {
            var me = this.view;
            var bps = me.query("BytePanel[isCompare=true]")
            bps.sort(function (a, b) {
                return a.items.length - b.items.length;
            })
            console.log(bps)
            if (!bps.length) {
                return;
            }
            bps[0].items.items.forEach(function (item, index) {
                bps.forEach(function (bp) {
                    if (bp.items.items[index].config.html != item.config.html) {
                        changeColor(bps, index, "red")
                    } else {
                        changeColor(bps, index, "black")
                    }
                })
            })
            function changeColor(bps, index, color) {
                bps.forEach(function (bp) {
                    bp.items.items[index].setBodyStyle("color", color)
                })
            }
        },
        searchMemory: function () {
            var searchvalue = this.view.viewModel.data.searchvalue;

            if (searchvalue.indexOf("+") >= 0) {
                var arr = searchvalue.split("+");
                var hand = Number("0x" + arr[0]);
                if (isNaN(arr[0])) {
                    hand = windowsapi.GetModelHandle(arr[0]);
                }
                hand = hand + Number("0x" + arr[1])
            }

            var searchvalue = hand// Number("0x" + this.view.viewModel.data.searchvalue).toString(10);
            var view = this.view;
            var bp = view.down("#basePoint");
            var bpstore = bp.store;
            bpstore.removeAll();
            if (!view.dpanel) {
                view.dpanel = Ext.create("DrawPanel", {
                })
                view.add(view.dpanel)
            }
            view.dpanel.removeAll();
            console.log("searchMemory searchvalue=", searchvalue)
            windowsapi.SearchInt(null, searchvalue, 0, 0, function (v) {
                view.dpanel.addObj(v);
                // bpstore.add({
                //     field1: Number(v).toString(16)
                // })
            })


        },
        readMemory: function () {
            var basePoint = Number("0x" + this.view.viewModel.data.basePoint).toString(10);
            var readLengh = this.view.viewModel.data.readLengh;
            console.log("readMemory basePoint=", basePoint)
            var arr = windowsapi.readProcessMemory(null, basePoint, readLengh);
            arr = arr.map(function (v, index) {
                return Number(v).toString(16);
            })
            this.view.viewModel.set("bytes", arr.join(" "));
        },

    },
    items: [
        {
            xtype: "form",
            items: [
                {
                    fieldLabel: "search value",
                    xtype: "textfield",
                    bind: "{searchvalue}",
                },
                {
                    xtype: "button",
                    text: "search",
                    handler: "searchMemory"
                },
                {
                    itemId: "basePoint",
                    fieldLabel: "basePoint",
                    xtype: "combo",
                    store: [],
                    bind: "{basePoint}"
                },
                {
                    xtype: "numberfield",
                    fieldLabel: "Read Length",
                    bind: "{readLengh}"
                },
                {
                    xtype: "button",
                    text: "read memory",
                    handler: "readMemory"
                },
                {
                    xtype: "textfield",
                    fieldLabel: "describe",
                    bind: "{describe}"
                }, {
                    xtype: "textarea",
                    width: "100%",
                    fieldLabel: "bytes",
                    bind: "{bytes}"
                }
            ],
            buttons: [
                {
                    xtype: "button",
                    text: "generate",
                    handler: "generateBytePanel"
                }, {
                    xtype: "button",
                    text: "Compare",
                    handler: "Compare"
                }
            ]
        }
    ]
})
Ext.define("BytePanel", {
    xtype: "BytePanel",
    extend: "Ext.panel.Panel",
    width: "100%",
    headerPosition: 'right',
    layout: {
        type: 'table',
        columns: 30,
        tableAttrs: {
            style: {
                width: '100%'
            }
        }
    },
    controller: {
        positionHidden: function () {
            var me = this.view;
            me.items.items.forEach(element => {
                element.header.setHidden(!element.header.hidden)
            });
        },
        isCompare: function (checkbox, newValue) {
            var me = this.view;
            console.log(arguments)
            me.isCompare = newValue
        }
    },
    buttons: [
        {
            hidden: true,
            text: "showtitle",
            handler: "positionHidden"
        },
        {
            xtype: "checkbox",
            fieldLabel: "Compare", handler: "isCompare"
        }
    ],
    generateByte: function (byteStr) {
        var me = this;

        console.log(me)
        var bytes = byteStr.split(" ");
        var arr = []
        for (let i = 0; i < bytes.length; i++) {
            let p = Ext.create("Ext.panel.Panel", {
                html: bytes[i],
                listeners: {
                    boxready: function (panel) {
                        let positionNumber = Number(i).toString(16)
                        var base = Number(parseInt(Number("0x" + me.basePoint).toString()) + (i)).toString("16")
                        Ext.create('Ext.tip.ToolTip', {
                            target: panel.getId(),
                            showDelay: 0,
                            hideDelay: 1000,
                            html: [positionNumber, me.basePoint, base].join("<br>")
                        });
                    },
                    el: {
                        click: function () {

                        }
                    }
                }
            })
            arr.push(p)
        }
        me.add(arr);

        return me;
    }
})

Ext.define("MemoryUtilPanel", {
    extend: "Ext.panel.Panel",
    xtype: "MemoryUtilPanel",
    border: true,
    width: 600,
    height: 500,
    layout: "border",
    viewModel: {
        data: {
            processname: "FTGMOS.exe",
            windowhandle: "",
            pid: "",
            BaseAddress: localStorage.getItem("BaseAddress"),
            usetime: 0,
            LoopStep: 4,
            queryArrayNumber: 1,
            MemoryStore:
                Ext.create("Ext.data.Store", {
                    fields: ["address", "int"],
                    data: [
                    ]
                })
        }
    },
    controller: {
        gridReady: function () {
            var viewModel = this.view.viewModel;

            setInterval(function () {
                return;
                var store = viewModel.get("MemoryStore")
                var hwnd = viewModel.get("windowhandle");
                var lpBaseAddress;
                var nSize = 4;
                var model;
                for (var i = 0; i < store.data.length; i++) {
                    model = store.data.items[i];
                    lpBaseAddress = model.data.address;
                    var num = windowsapi.readProcessMemory(hwnd, lpBaseAddress, nSize)

                    model.set("int", num);
                }
            }, 2000)

        },
        onShowFilters: function () {
            var data = [];
            var store = this.view.viewModel.get("MemoryStore")
            // The actual record filters are placed on the Store.
            store.getFilters().each(function (filter) {
                data.push(filter.serialize());
            });
            // Pretty it up for presentation
            data = Ext.JSON.encodeValue(data, '\n').replace(/^[ ]+/gm, function (s) {
                for (var r = '', i = s.length; i--;) {
                    r += '&#160;';
                }
                return r;
            });
            data = data.replace(/\n/g, '<br>');
            Ext.Msg.alert('Filter Data', data);
        },
        onClearFilters: function (field) {
            field.up("grid").filters.clearFilters();
        },
        baseAddressChange: function (filed, newValue) {
            localStorage.setItem("BaseAddress", newValue)
        },
        bindWindowHandle: function (fiele, newValue) {
            var viewModel = this.view.viewModel;
            console.log(newValue)
            var hwnd = windowsapi.getWindowHwnd(newValue);
            console.log(hwnd)
            this.view.viewModel.set("windowhandle", hwnd)
            var pid = windowsapi.getWndPid(hwnd);
            this.view.viewModel.set("pid", pid)
        },
        queryArray: function () {
            console.log(this)
            var viewModel = this.view.viewModel;
            var hwnd = parseInt(viewModel.get("windowhandle"), 10);
            var lpBaseAddress = parseInt(viewModel.get("BaseAddress"), 16);
            var queryArrayNumber = viewModel.get("queryArrayNumber");
            var LoopStep = viewModel.get("LoopStep")
            var arr = [];
            var nSize = 4;
            var buf = Buffer.alloc(4);
            //console.log(windowsapi.readProcessMemory(hwnd,0x082395E0,100))
            var buf;
            var startTime = new Date().getTime()
            for (var i = 0; i < queryArrayNumber; i++) {
                console.log(lpBaseAddress);
                res = windowsapi.readProcessMemory(hwnd, lpBaseAddress, nSize);
                console.log(res)
                buf = Buffer.from(res);
                arr.push({
                    address: lpBaseAddress,
                    int: buf.readInt32BE()
                })
                lpBaseAddress += 4;
            }
            var store = viewModel.get("MemoryStore").setData(arr);
            viewModel.set("usetime", ((new Date().getTime() - startTime) / 1000) + "s")
        }
    },
    items: [
        {
            xtype: "panel",
            region: "south",
            bind: {
                html: "use time :{usetime}"
            }
        },
        {
            xtype: "form",
            region: "north",
            items: [
                {
                    xtype: "textfield",
                    bind: "{processname}",
                    fieldLabel: "Process Name",
                    listeners: {
                        change: "bindWindowHandle"
                    }
                },
                {
                    xtype: "button",
                    text: "Binding Handle",
                    id: "testbt",
                    hidden: true,
                    handler: "bindWindowHandle"
                },
                {
                    fieldLabel: "Window Handle",
                    xtype: "textfield",
                    bind: "{windowhandle}"
                },
                {
                    fieldLabel: "PID",
                    xtype: "textfield",
                    bind: "{pid}"
                },
                {
                    fieldLabel: "Base Address",
                    xtype: "textfield",
                    bind: "{BaseAddress}",
                    listeners: {
                        change: "baseAddressChange"
                    }
                }, {
                    fieldLabel: "query number",
                    xtype: "numberfield",
                    bind: "{queryArrayNumber}",
                    minValue: 1
                },
                {
                    fieldLabel: "loop step",
                    xtype: "numberfield",
                    bind: "{LoopStep}"
                },
                {
                    xtype: "button",
                    text: "query",
                    handler: "queryArray"
                }
            ]
        },
        {
            xtype: "grid",
            requires: [
                'Ext.grid.filters.Filters',
            ],
            region: "center",
            resizable: true,
            tateful: true,
            multiSelect: true,
            plugins: 'gridfilters',
            tbar: [{
                text: 'Show Filters...',
                tooltip: 'Show filter data for the store',
                handler: 'onShowFilters'
            }, {
                text: 'Clear Filters',
                tooltip: 'Clear all filters',
                handler: 'onClearFilters'
            }],
            bind: {
                store: "{MemoryStore}"
            },
            listeners: {
                boxready: "gridReady"
            },
            columns: [{
                dataIndex: 'address',
                text: 'Address',
                flex: 1,
                filter: 'number',
                edit: true,
                renderer: function (v) {
                    return Number(v).toString(16)
                }
            }, {
                dataIndex: 'int',
                text: 'int',
                flex: 1,
                hidden: false,
                filter: {
                    type: 'string',
                    itemDefaults: {
                        emptyText: 'Search for...'
                    }
                }
            }, {
                dataIndex: 'int',
                text: 'int',
                flex: 1,
                filter: 'number',
            }, {
                dataIndex: 'size',
                hidden: true,
                text: 'Size',
                width: 120,
                filter: 'list' // Use the unique field values for the pick list
            }],
        }]
})

Ext.define("fentengLoginPanel", {
    extend: "Ext.form.Panel",
    title: "login",
    width: 500,
    url: "http://game.sxfenteng.com/PageJsp/gameLogin1002.jsp",
    defaultType: 'textfield',
    items: [{
        fieldLabel: 'User Name',
        name: 'userid',
        bind: "{userid}",
        allowBlank: false
    },
    {
        fieldLabel: 'User Name',
        name: 'userid',
        bind: "{name}",
        allowBlank: false
    },
    {
        fieldLabel: 'Password',
        name: 'password',
        bind: "{password}",
        allowBlank: false
    }, {
        name: 'region',
        value: 0,
        xtype: "hiddenfield",
        allowBlank: false
    }, {
        name: 'checknum',
        value: "xjjyjiashangqinrenmajiangcaishizhenai7654321",
        xtype: "hiddenfield",
        allowBlank: false
    }, {
        name: 'sign',
        bind: "{sign}",
        xtype: "hiddenfield",
        allowBlank: false
    }, {
        xtype: 'textareafield',
        anchor: '100%',
        disabled: true,
        publishs: "logininfo",
        reference: 'country',
        listeners: {
            change: function (field, newValue) {
                console.log(field)
                field.up("form").viewModel.set("logininfo", newValue);
            }
        },
        bind: {
            value: "http://140.143.94.113/gameser/fr_www/ourgamestart.fcc+starhome_lz_fr?('{userid}','{ftvalid}','10')"
        }
    }],
    viewModel: {
        data: {
            logininfo: '',
            gamePath: "D:/Program Files/FancyBoxII Games/newsystem/FTGMOS.exe"
        }
    },
    // userid=a5461789&password=a5461789&region=0&checknum=xjjyjiashangqinrenmajiangcaishizhenai7654321&sign=65ddeb30ff3f741d79d5879ce6fa86e4
    //"http://140.143.94.113/gameser/fr_www/ourgamestart.fcc+starhome_lz_fr?('a5461789','PwjWXhnZbYdMm8gD','10')"

    // Reset and Submit buttons
    controller: {
        login: function () {
            var child_process = require("child_process")
            console.log(this.view.viewModel)
            var logininfo = this.view.viewModel.data.logininfo;
            child_process.execFile("D:/Program Files/FancyBoxII Games/newsystem/FTGMOS.exe", [logininfo]);
            this.view.up("MainPanel").add(Ext.create("MemoryUtilPanel", {
            }))
            this.view.up("MainPanel").add(Ext.create("ByteCompare", {
            }))
        },
        submit: function (parm1) {
            var formPanel = this.view;
            var form = formPanel.getForm();
            if (form.isValid()) {
                form.submit({
                    success: function (form, action) {
                        console.log(arguments)
                        Ext.Msg.alert('Success', action.result.msg);
                    },
                    failure: function (form, action) {
                        var arr = action.response.responseText.split(",");
                        formPanel.viewModel.set("ftvalid", arr[1])

                        console.log(arguments)
                        //Ext.Msg.alert('Failed', action.result.msg);
                    }
                });
            }
        }
    },
    buttons: [{
        text: 'Reset',
        hidden: true,
        handler: function () {
            this.up('form').getForm().reset();
        }
    },
    {
        text: "login game",
        handler: "login"
    },
    {
        text: 'Submit',
        formBind: true, //only enabled once the form is valid
        disabled: true,
        handler: "submit"
    }],
})
