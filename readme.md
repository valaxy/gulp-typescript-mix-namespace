> No finished yet

# For Example

    // src/serviceLayer/MyModule.d.ts
    import MyType from './MyType';
    declare class MyModule {
        private _myMember;
        run(param: MyType);
    }
    export default MyModule;
    
will convert to

    // dest/serviceLayer/MyModule.d.ts
    declare module "serviceLayer/MyModule" {
        import MyType from './MyType';
        class MyModule {
            private _myMember;
            run(param: MyType);
        }
        export default MyModule;
    }    

# Usage        