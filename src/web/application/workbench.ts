/*!
 * Authors:
 *      jason <jasonsoop@gmail.com>
 * 
 * Copyright (C) 2010-present Flagwind Inc. All rights reserved. 
 */

import flagwind from "flagwind-core";
import WorkbenchBase = flagwind.WorkbenchBase;
import ApplicationContextBase = flagwind.ApplicationContextBase;
import ApplicationContext from "./context";
import Workspace from "./workspace";

import Vue from "vue";
import Router from "vue-router";
import routes from "../routes";

// 导入系统组件
import { components } from "flagwind-web";

// 倒入全局样式
import "flagwind-web/dist/styles/flagwind.css";
import "wcjs-player/css/general.css";
import "src/web/styles/index.less";

/**
 * 提供工作台的基本封装。
 * @class
 * @version 1.0.0
 */
export default class Workbench extends WorkbenchBase
{
    private _workspace: Workspace;
    
    /**
     * 获取当前应用的主工作空间。
     * @property
     * @returns Workspace
     */
    public get workspace(): Workspace
    {
        return this._workspace;
    }
    
    /**
     * 初始化工作台的新实例。 
     * @param  {ApplicationContextBase} applicationContext
     */
    public constructor(context: ApplicationContextBase)
    {
        super(context);
    }
    
    /**
     * 当工作台打开时调用。
     * @async
     * @protected
     * @virtual
     * @param  {Array<string>} args
     * @returns void
     */
    protected async onOpen(args: Array<string>): Promise<void>
    {
        let context = this.applicationContext as ApplicationContext;

        Vue.config.productionTip = false;
        
        Vue.config.errorHandler = (err, vm, info) =>
        {
            console.error(err, vm, info);
        };
        
        Vue.config.warnHandler = (msg, vm, trace) =>
        {
            console.warn(msg, vm, trace);
        };
        
        // 初始化组件
        this.initializeComponent(context);
        
        // 初始化路由程序
        this.initializeRouter(context);
        
        // 初始化状态管理程序
        this.initializeStore(context);

        // 初始化快捷键
        this.initializeShortcut(context);
        
        // 初始化工作空间
        this._workspace = this.createWorkspace();
    }
    
    /**
     * 创建一个工作空间对象。
     * @override
     * @returns IWorkspace
     */
    protected createWorkspace(): Workspace
    {
        return new Workspace(this);
    }

    /**
     * 初始化全局组件。
     * @param  {ApplicationContext} context 应用程序上下文实例。
     * @returns void
     */
    private initializeComponent(context: ApplicationContext): void
    {
        // 注册系统组件
        Vue.use(components);
        
        // 注册应用组件
        
        // 注册布局母版
    }
    
    /**
     * 初始化路由程序。
     * @param  {ApplicationContext} context 应用程序上下文实例。
     * @returns void
     */
    private initializeRouter(context: ApplicationContext): void
    {
        // 注册路由组件
        Vue.use(Router);
        
        // 初始化路由程序
        let router = new Router({routes});
        
        // 设置路由程序
        context.router = router;
    }
    
    /**
     * 初始化状态管理程序。
     * @param  {ApplicationContext} context 应用程序上下文实例。
     * @returns void
     */
    private initializeStore(context: ApplicationContext): void
    {
        // 注册状态管理程序
        // Vue.use(Vuex);

        // 初始化状态容器
        // let store = new Vuex.Store
        // ({
        //     modules
        // });
        
        // 设置状态容器
        // context.store = store;
    }
    
    /**
     * 初始化状态管理程序。
     * @param  {ApplicationContext} context 应用程序上下文实例。
     * @returns void
     */
    private initializeShortcut(context: ApplicationContext): void
    {
        window.addEventListener("keyup", (e: KeyboardEvent) =>
        {
            // 绑定 F2 快捷键，跳转至设置视图
            if(e.keyCode === 113)
            {
                context.router.push("/settings");
            }

            // 绑定 F8 快捷键，跳转至引导视图
            if(e.keyCode === 119)
            {
                context.router.push("/guide");
            }

        }, true);
    }
}
