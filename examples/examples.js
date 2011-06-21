// buttons setup

$(function () {

    var converter = new Showdown.converter();
    $('.markdown').each(function () {
        var element = $(this);
        element.replaceWith(converter.makeHtml(element.text()));
    });

    $('#show_dtd').click(function () {
        alert(
                    JSON.stringify(
                        DTD,
                        undefined,
                        '\t'
                    )
                );
    });

    $('#show_data').click(function () {
        alert(
                    JSON.stringify(
                        data,
                        undefined,
                        '\t'
                    )
                );
    });

    $('#gather').click(function () {
        alert(
                    JSON.stringify(
                        editor.gather($('#container')),
                        undefined,
                        '\t'
                    )
                );
    });

    $('#styles').click(function () {
        alert(
            $('#styling').text()
                );
    });

    $('#internal').click(function () {
        var styles = BaseDTDEditor.defaults.styles;
        var set = {};
        for (var name in styles) {
            var value = styles[name].split(' ');
            for(var num in value) {
                var class = value[num];
                set[class] = 1;
            }
        }
        var classes = [];
        for(var class in set) {
            classes.push(class);
        }
        alert(
            classes.sort().join('\n')
                );
    });

});