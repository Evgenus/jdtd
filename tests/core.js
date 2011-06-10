setup = function () {
    this.container = $('<div>')
        .attr('id', 'data_form')
        .appendTo('body')
        .css('display', 'none');
}

teardown = function () {
    this.container.remove();
}

make_editor = function (DTD) {
    this.editor = StandAloneDTDEditor(DTD);
}

test_gather = function (data) {
    this.container.empty();
    this.marked_data = this.editor.markup(data);
    this.editor.create(this.container, this.marked_data);
    this.editor.gather(this.container);
    var result = this.editor.gather(this.container);
    deepEqual(data, result, "data gathered incorrectly");
}



// _________________________________________________________________________ //

module("Self checks", { setup: setup, teardown: teardown });

test("Checking with DTD", function () {
    make_editor.call(this, self_check_DTD_DTD);
    test_gather.call(this, self_check_DTD_DTD);
    test_gather.call(this, self_check_EDTD_DTD);
});

test("Checking DTD with EDTD", function () {
    make_editor.call(this, self_check_DTD_EDTD);
    test_gather.call(this, self_check_DTD_DTD);
});

test("Checking EDTD with EDTD", function () {
    make_editor.call(this, self_check_EDTD_EDTD);
    test_gather.call(this, self_check_EDTD_EDTD);
    test_gather.call(this, self_check_DTD_EDTD);
});

// _________________________________________________________________________ //

module("Gathering", { setup: setup, teardown: teardown });

test("Complex data test #1", function () {
    make_editor.call(this, complex_DTD_1);
    test_gather.call(this, complex_data_1);
});

test("Complex data test #2", function () {
    make_editor.call(this, complex_DTD_2);
    test_gather.call(this, complex_data_2_1);
    test_gather.call(this, complex_data_2_2);
});
