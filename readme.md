> No finished yet

# For Example

```typescript
// src/serviceLayer/MyModule.d.ts
import MyType from './MyType';
declare class MyModule {
    private _myMember;
    run(param: MyType);
}
export default MyModule;
```    
    
will convert to

```typescript
// dest/serviceLayer/MyModule.d.ts
declare module "serviceLayer/MyModule" {
    import MyType from 'serviceLayer/MyType';
    class MyModule {
        private _myMember;
        run(param: MyType);
    }
    export default MyModule;
}
```

# Usage        