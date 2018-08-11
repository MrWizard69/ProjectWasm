(function () {

    Module.onRuntimeInitialized = function() {

        let int_sqrt = Module.cwrap('test', 'number', ['number']);
        console.log(int_sqrt(12));
    }

}());