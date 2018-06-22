/*!
 * Authors:
 *      jason <jasonsoop@gmail.com>
 * 
 * Copyright (C) 2010-present Flagwind Inc. All rights reserved. 
 */

import path from "path";
import flagwind from "flagwind-core";
import IWorkbench = flagwind.IWorkbench;
import ApplicationContextBase = flagwind.ApplicationContextBase;
import Workbench from "./workbench";

/**
 * 包含当前应用程序的上下文实例。
 * @class
 * @version 1.0.0
 */
export default class ApplicationContext extends ApplicationContextBase
{
    private _mainUrl: string;
    
    /**
     * 获取当前应用的入口地址。
     * @property
     * @returns string
     */
    public get mainUrl(): string
    {
        return this._mainUrl;
    }

    /**
     * 获取当前应用程序的上下文实例。
     * @static
     * @member
     */
    public static readonly current: ApplicationContext = new ApplicationContext();
    
    /**
     * 私有构造函数。
     * @private
     */
    protected constructor()
    {
        super("wayto-toilets-client");
        
        // 设置主窗口地址
        this._mainUrl = process.env.NODE_ENV === "development" ? "http://localhost:9080" : `file://${__dirname}/index.html`;
        
        /**
         * Set `__static` path to static files in production
         * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
         */
        if(process.env.NODE_ENV !== "development")
        {
            global["__static"] =  path.join(__dirname, "/static").replace(/\\/g, "\\\\");
        }
    }

    /**
     * 创建一个工作台对象。
     * @override
     * @returns IWorkbench
     */
    protected createWorkbench(args: Array<string>): IWorkbench
    {
        return new Workbench(this);
    }
}
