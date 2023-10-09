import {SourceTextModule, SyntheticModule, createContext} from 'vm';

async function link() {
    // Having a shared context leaks nodejs memory
    let context = createContext()
    const module = new SourceTextModule(`
        // import foo from 'foo';
        
        export default {a: new Array(100000).fill('-')};
    `, {
        context,
        identifier: ''
    });

    const subModule = new SourceTextModule(`
        import asd from 'asd.json';

        export default asd;
    `, {
        context,
        identifier: 'foo'
    })


    const jsonModule = new SyntheticModule(
        ['default'],
        function () {
            // mimic some large file
            this.setExport('default', {a: new Array(100000).fill('-')});
        },
        {
            context,
            identifier: 'asd.json'
        }
    )

    await subModule.link(() => jsonModule)
    await module.link(() => subModule)




    await module.evaluate();

    // UN-COMMENT THIS LINE TO FIX THE LEAK?? wtf...
    // context = null

    return module;
}

for (let i = 0; i < 100000; i++) {
    if (i % 100 === 0) {
        console.log("iterations" + i)
    }
    await link();
}
