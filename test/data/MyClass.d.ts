import RefClassSameDir from './RefClassSameDir'
import RefClassNotSameDir from '../RefClassNotSameDir'
import AbsoluteClass from 'AbsoluteClass'

declare class MyModule {
    private _myMember;

    run(param:RefClassNotSameDir);
}
export default MyModule;