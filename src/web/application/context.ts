/*!
 * Authors:
 *      jason <jasonsoop@gmail.com>
 * 
 * Copyright (C) 2010-present Flagwind Inc. All rights reserved. 
 */

import Router from "vue-router";
import Vuex, { Store } from "vuex";
import flagwind from "flagwind-core";
import IWorkbench = flagwind.IWorkbench;
import ApplicationContextBase = flagwind.ApplicationContextBase;
import InvalidOperationException = flagwind.InvalidOperationException;
import Workbench from "./workbench";

/**
 * 包含当前应用程序的上下文实例。
 * @class
 * @version 1.0.0
 */
export default class ApplicationContext extends ApplicationContextBase
{
    private _router: Router;
    private _store: Store<any>;
    
    /**
     * 获取或设置当前应用的主路由对象。
     * @property
     * @returns Router
     */
    public get router(): Router
    {
        return this._router;
    }
    
    public set router(value: Router)
    {
        if(!value)
        {
            throw new InvalidOperationException();
        }

        this._router = value;
    }
    
    /**
     * 获取或设置当前应用的状态管理对象。
     * @property
     * @returns Store<any>
     */
    public get store(): Store<any>
    {
        return this._store;
    }
    
    public set store(value: Store<any>)
    {
        if(!value)
        {
            throw new InvalidOperationException();
        }

        this._store = value;
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
        super("flagwind-rtsp-player");
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
