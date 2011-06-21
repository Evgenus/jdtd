//
// JDTD - JSON Data Type Definition
//
// Copyright (c) 2011, Eugene Chernyshov
// Licensed under the LGPL.
//

// TODO: I need tests for this
// TODO:    Tests for description (names vs ids)
// TODO:    Description of keys in items with dynamic and static keys
// TODO:    Description of values in items with dynamic and static keys


var Check = Class.$extend({
});



var CheckValue = Check.$extend({
    __classvars__: {
        simple: true
    },

    __init__: function (context, check_data) {
        this.id = check_data.id;
        this.value = check_data.value;
    },

    create: function (context, container, description) {
        var element = $("<span>")
            .text(description.label
                ? description.label
                : this.id);
        element.addClass(context.styles.check_value);
        element.addClass(description.class);
        return element;
    },

    gather: function (context, container) {
        return this.value;
    },

    markup: function (context, value) {
        if (value != this.value) {
            throw 'NotMatchedByValue ' + this.value + '. value = ' + value;
        }
        return {
            type: 'CheckValue',
            value: value
        };
    }
});


var AtomicChecker = Class.$extend({
    __init__: function (id) {
        this.id = id;
    }
});

var Check_int = AtomicChecker.$extend({
    create: function (context, value, description) {
        var input = $('<input>')
            .attr('name', this.id);
        input.val(value);
        input.keyup(function() {
            var self = $(this);
            var value = self.val();
            if(value.indexOf('.')!=-1 || Math.floor(Number(value)) != value) {
                self.addClass(context.styles.invalid_input);
            } else {
                self.removeClass(context.styles.invalid_input);
            } 
        });   
        return input
            .addClass(context.styles.check_type);
    },

    gather: function(context, container) {
        var value = container.val();
        return Number(value);
    },

    check: function(value) {
        return value != undefined
            && value.constructor == Number 
            && Math.floor(value) == value;
    }
});



var Check_float = AtomicChecker.$extend({
    create: function (context, value, description) {
        var input = $('<input>')
            .attr('name', this.id);
        input.val(value);
        input.keyup(function() {
            var self = $(this);
            var value = self.val();
            if(isNaN(Number(self.val()))) {
                self.addClass(context.styles.invalid_input);
            } else {
                self.removeClass(context.styles.invalid_input);
            } 
        });   
        return input
            .addClass(context.styles.check_type);
    },

    gather: function(context, container) {
        var value = container.val();
        return Number(value);
    },

    check: function(value) {
        return value != undefined 
            && value.constructor == Number;
    }
});



var Check_str = AtomicChecker.$extend({
    create: function (context, value, description) {
        var input = $('<input>')
            .attr('name', this.id);
        input.val(value);
        return input
            .addClass(context.styles.check_type);
    },

    gather: function(context, container) {
        var value = container.val();
        return value!='' ? value : undefined;
    },

    check: function(value) {
        return value != undefined 
            && value.constructor == String;
    }
});

var Check_basestring = Check_str;
var Check_unicode = Check_str;



var Check_bool = AtomicChecker.$extend({
    create: function (context, value, description) {
        var input = $('<input type="checkbox">')
            .attr('name', this.id);
        if(value) {
            input.attr('checked', 'checked');
        }
        return input
            .addClass(context.styles.check_type);
    },

    gather: function(context, container) {
        var value = container.val();
        if(container.attr('checked')) {
            return true;
        } else {
            return false;
        }
    },

    check: function(value) {
        return value != undefined 
            && value.constructor == Boolean;
    }
});



var CheckType = Check.$extend({
    __classvars__: {
        simple: true
    },

    __init__: function (context, check_data) {
        this.id = check_data.id;
        this.type = check_data.type;
        this.provider = window['Check_' + this.type](this.id);
    },

    create: function (context, data, description) {
        var data_value = data ? data.value : undefined;
        var element = this.provider.create(context, data_value, description);
        element.addClass(description.class);
        return element;
    },

    gather: function (context, container) {
        return this.provider.gather(context, container)
    },

    markup: function (context, value) {
        if (!this.provider.check(value)) {
            throw 'NotMatchedByType ' + this.type + '. value = ' + value;
        }
        return {
            type: 'CheckType',
            value: value
        };
    }
});



var CheckMany = Check.$extend({
    __classvars__: {
        simple: false
    },

    __init__: function (context, check_data) {
        this.id = check_data.id;
        this.item = check_data.item;
    },

    create: function (context, data, description) {
        var checker = context.get_checker(this.item);
        var container = $('<table>');
        var holder = $('<tbody>').appendTo(container);
        if (data) {
            for (var num in data.values) {
                var value = data.values[num];
                holder
                    .append(
                        AddManyItem(checker, context, value)
                    );
            }
        }

        var add_btn = $('<a href="javascript:;">')
            .click(AddManyItemEvent)
            .addClass(context.styles.dynamic_button_add);

        add_btn.text(
            description.add_button_text 
                ? description.add_button_text
                : context.add_button_text
            );

        holder
            .append(
                $('<tr>')
                    .append(
                        $('<td>'),
                        $('<td colspan="2">')
                            .append(add_btn)
                    )
            );

        var element = add_btn[0];
        element.checker = checker;
        element.context = context;

        container.addClass(context.styles.check_many);
        container.addClass(description.class);
        return container
    },

    gather: function (context, container) {
        var data = [];
        var checker = context.get_checker(this.item);
        container.children('tbody').children('tr[data-many-row=true]')
            .each(function () {
                var element = $(this).children('td')
                       .children('[data-many-item=' + checker.id + ']')
                data.push(checker.gather(context, element));
            });
        return data;
    },

    markup: function (context, values) {
        if (!isArray(values)) {
            throw 'NotMatchedByMany. type = ' + values.constructor;
        }
        var items = [];
        var checker = context.get_checker(this.item);
        for (var num in values) {
            var item = values[num];
            items.push(checker.markup(context, item));
        }
        return {
            type: 'CheckMany',
            values: items
        };
    }
});



var CheckRule = Check.$extend({
    __classvars__: {
        simple: false
    },

    __init__: function (context, check_data) {
        this.id = check_data.id;
        this.rule = check_data.rule;
    },

    create: function (context, data, description) {
        var data_rule = data != undefined ? data.rule : undefined;
        var rule = context.get_rule_by_name(this.rule);
        var element = rule.create(context, data_rule);
        element.addClass(context.styles.check_rule);
        element.addClass(description.class);
        return element;
    },

    gather: function (context, container) {
        var rule = context.get_rule_by_name(this.rule);
        return rule.gather(context, container);
    },

    markup: function (context, value) {
        var rule = context.get_rule_by_name(this.rule);
        return {
            type: 'CheckRule',
            rule: rule.markup(context, value)
        };
    }
});



var RuleCollectItem = Class.$extend({
    __init__: function (id, key, value, description) {
        this.id = id;
        this.key = key;
        this.value = value;
        this.description = description;
        this.key_description = description.key ? description.key : {};
        this.value_description = description.value ? description.value : {};
    }
});



var StaticTabularItem = RuleCollectItem.$extend({
    create: function(context, data) {
        var data_value = data!=undefined ? data.value : undefined;
        var key_element = $('<td>')
            .attr('data-item-part', 'key')
            .addClass(context.styles.static_tabular_item_key);
        key_element.text(this.key_description.label
            ? this.key_description.label
            : this.id);

        var value_container = $('<tr>')
            .attr('data-item-name', this.id)
            .append(
                key_element,
                $('<td>')
                    .attr('data-item-part', 'value')
                    .append(
                        this.value.create(context, data_value, 
                                this.value_description)
                            .attr('data-item-value', this.id)
                        )
                    .addClass(context.styles.static_tabular_item_value)
                );
        return value_container
            .addClass(context.styles.static_tabular_item);
    },
    gather: function(context, container, data) {
        var value_container = container
            .children('[data-item-part=value]')
                .children('[data-item-value="' + this.id + '"]');
        var key = this.key.gather(context, container);
        var value = this.value.gather(context, value_container);
        if(key!=undefined && value!=undefined) {
            data[key] = value;
        }
    }
});



var StaticSimpleItem = RuleCollectItem.$extend({
    create: function(context, data) {
        var data_value = data!=undefined ? data.value : undefined;
        var value_container = $('<div>')
            .attr('data-item-name', this.id)
            .append(
                $('<span>')
                    .attr('data-item-part', 'key')
                    .text(this.key_description.label
                        ? this.key_description.label
                        : this.id)
                    .addClass(context.styles.static_simple_item_key),
                this.value.create(context, data_value, 
                        this.value_description)
                    .attr('data-item-part', 'value')
                    .attr('data-item-value', this.id)
                    .addClass(context.styles.static_simple_item_value)
            );
        return value_container
            .addClass(context.styles.static_simple_item);
    },

    gather: function(context, container, data) {
        var value_container = container
            .children('[data-item-value="' + this.id + '"]');
        var key = this.key.gather(context, container);
        var value = this.value.gather(context, value_container);
        if(key!=undefined && value!=undefined) {
            data[key] = value;
        }
    }
});



var StaticPlainItem = RuleCollectItem.$extend({
    create: function (context, data) {
        var data_value = data != undefined ? data.value : undefined;
        var key_element = $('<div>')
            .attr('data-item-part', 'key')
            .addClass(context.styles.static_plain_item_key);

        key_element.text(this.key_description.label
            ? this.key_description.label
            : this.id);

        var value_container = $('<div>')
            .attr('data-item-name', this.id)
            .append(
                key_element,
                $('<div>')
                    .attr('data-item-part', 'value')
                    .append(
                        this.value.create(context, data_value,
                                this.value_description)
                            .attr('data-item-value', this.id)
                    )
                    .addClass(context.styles.static_plain_item_value)
            )
        return value_container
            .addClass(context.styles.static_plain_item);
    },

    gather: function (context, container, data) {
        var value_container = container
            .children('[data-item-part=value]')
                .children('[data-item-value="' + this.id + '"]');
        var key = this.key.gather(context, container);
        var value = this.value.gather(context, value_container);
        data[key] = value;
    }
});



var DynamicPlainItem = RuleCollectItem.$extend({
    create: function (context, data) {
        var data_key = data != undefined ? data.key : undefined;
        var data_value = data != undefined ? data.value : undefined;
        var container = $('<div>')
            .attr('data-item-name', this.id);
        var key_container = $('<div>')
            .attr('data-item-part', 'key');
        key_container.append(
                this.key.create(context, data_key, this.key_description)
                    .attr('data-item-key', this.id)
                )
            .addClass(context.styles.dynamic_plain_item_key);
        var value_container = $('<div>')
            .attr('data-item-part', 'value')
            .append(
                this.value.create(context, data_value,
                        this.value_description)
                    .attr('data-item-value', this.id)
                )
            .addClass(context.styles.dynamic_plain_item_value);
        container.append(
            key_container,
            value_container
            );
        return container
            .addClass(context.styles.dynamic_plain_item);
    },

    gather: function (context, container, data) {
        var key_container = container
            .children('[data-item-part=key]')
                .children('[data-item-key="' + this.id + '"]');
        var value_container = container
            .children('[data-item-part=value]')
                .children('[data-item-value="' + this.id + '"]');
        var key = this.key.gather(context, key_container);
        var value = this.value.gather(context, value_container);
        data[key] = value;
    }
});



var Rule = Class.$extend({
});



var RuleCollect = Rule.$extend({
    __init__: function (context, rule_data) {
        this.static_tabular = {};
        this.static_plain = {};
        this.dynamic_plain = {};
        this.all = {};
        this.name = rule_data.name;
        if (isSingle(rule_data.static_tabular)) {
            this.convert(context, rule_data.static_tabular,
                this.static_plain, StaticSimpleItem);
        } else {
            this.convert(context, rule_data.static_tabular,
                this.static_tabular, StaticTabularItem);
        }

        this.convert(context, rule_data.static_plain,
            this.static_plain, StaticPlainItem);
        this.convert(context, rule_data.dynamic_plain,
            this.dynamic_plain, DynamicPlainItem);
    },

    convert: function (context, collection, container, cls) {
        for (var num in collection) {
            var item_data = collection[num];
            var key = context.get_checker(item_data.key);
            var value = context.get_checker(item_data.value);
            var item = cls(item_data.name, key, value,
                item_data.key_description,
                item_data.value_description);
            this.all[item_data.name] = item;
            container[item_data.name] = item;
        }
    },

    create: function (context, data) {
        var rule_container = $('<div>')
            .attr('data-type', 'RuleCollect')
            .attr('data-name', this.name);
        if (notEmpty(this.static_tabular)) {
            var static_tabular_part = $('<table>')
                .attr('data-collect-part', 'static_tabular');
            for (var num in this.static_tabular) {
                var item = this.static_tabular[num];
                static_tabular_part.append(
                    item.create(context, find_item_data(item, data))
                        .attr('data-collect-item', this.name)
                    );
            }
            rule_container.append(
                static_tabular_part
                    .addClass(context.styles.part_static_tabular)
                );
        }

        if (notEmpty(this.static_plain)) {
            var static_plain_part = $('<div>')
                .attr('data-collect-part', 'static_plain');
            for (var num in this.static_plain) {
                var item = this.static_plain[num];
                static_plain_part.append(
                    item.create(context, find_item_data(item, data))
                        .attr('data-collect-item', this.name)
                    );
            }
            rule_container.append(
                static_plain_part
                    .addClass(context.styles.part_static_plain)
                );
        }


        if (notEmpty(this.dynamic_plain)) {
            var dynamic_plain_part = $('<div>')
                .attr('data-collect-part', 'dynamic_plain');
            var add_btn = $('<a href="javascript:;">')
                .click(AddDynamicElementEvent)
                .addClass(context.styles.dynamic_button_add);
            add_btn.text(context.add_button_text);
            dynamic_plain_part.append(add_btn);
            var element = add_btn[0];
            element.rule = this;
            element.context = context;
            if (data) {
                for (var num in data.items) {
                    var item_data = data.items[num];
                    var item = this.dynamic_plain[item_data.rule];
                    if (item) {
                        AddDynamicElement(this, context, item_data)
                            .insertBefore(add_btn);
                    }
                }
            }
            rule_container.append(
                dynamic_plain_part
                    .addClass(context.styles.part_dynamic_plain)
                );
        }
        return rule_container
            .addClass(context.styles.rule_collect);
    },

    gather: function (context, container) {
        var data = {};
        var rule = this;
        var parts = container
            .children('[data-collect-part=static_tabular]')
                .children('tbody');
        $.merge(parts, container.children('[data-collect-part=static_plain]'));
        $.merge(parts,
            container
                .children('[data-collect-part=dynamic_plain]')
                    .children('[data-dynamic-helper=holder]')
                        .children('[data-dynamic-helper=wrapper]')
            );
        parts.children('[data-collect-item=' + this.name + ']')
            .each(function () {
                var self = $(this);
                var item = rule.all[self.attr('data-item-name')];
                item.gather(context, self, data);
            });
        return data;
    },
    itervariants: function (body) {
        for (var name in this.static_tabular) {
            var item = this.static_tabular[name];
            try {
                var value = body(name, item);
            } catch (error) {
                continue;
            }
            return value;
        };
        for (var name in this.static_plain) {
            var item = this.static_plain[name];
            try {
                var value = body(name, item);
            } catch (error) {
                continue;
            }
            return value;
        };
        for (var name in this.dynamic_plain) {
            var item = this.dynamic_plain[name];
            try {
                var value = body(name, item);
            } catch (error) {
                continue;
            }
            return value;
        };
        throw 'NotMatchedByCollectRules';
    },
    markup: function (context, collection) {
        if (!isObject(collection)) {
            throw 'NotMatchedInCollect. value = ' + value;
        }
        var items = [];
        var self = this;
        iteritems(collection, function (key, value) {
            self.itervariants(function (name, item) {
                var marked_key = item.key.markup(context, key);
                var marked_value = item.value.markup(context, value);
                return items.push({
                    type: 'RuleItem',
                    rule: name,
                    key: marked_key,
                    value: marked_value
                });
            });
        });
        return {
            type: 'RuleCollect',
            name: this.name,
            items: items
        };
    }
});



var BaseVariant = Class.$extend({
    __init__: function (id, variant, description) {
        this.id = id;
        this.variant = variant;
        this.description = description;
    }
});



var StaticVariant = BaseVariant.$extend({
    create: function(context, data) {
        var option = $('<option>')
            .attr('data-item-type', 'StaticVariant')
            .attr('value', this.id);
        option.text(this.id);
        return option
            .addClass(context.styles.variant_static);
    },
    gather: function(context, container) {
        return this.variant.gather(context, container);
    }
});

var DynamicVariant = BaseVariant.$extend({
    create: function(context, data) {
        var option = $('<option>')
            .attr('data-item-type', 'DynamicVariant')
            .attr('value', this.id);
        option.text(this.id);
        return option
            .addClass(context.styles.variant_static);
    },
    gather: function(context, container) {
        return this.variant.gather(context, container);
    }
});

var RuleVariant = Rule.$extend({
    __init__: function (context, rule_data) {
        this.static = {};
        this.dynamic = {};
        this.all = {};
        this.name = rule_data.name;
        this.convert(context, rule_data.static, this.static, StaticVariant);
        this.convert(context, rule_data.dynamic, this.dynamic, DynamicVariant);
    },
    convert: function (context, collection, container, cls) {
        for (var num in collection) {
            var item = collection[num];
            var variant_data = context.get_checker(item.variant);
            var variant = cls(
                item.name,
                variant_data,
                item.description);
            container[item.name] = variant;
            this.all[item.name] = variant;
        }
    },
    create: function (context, data) {
        var container = $('<div>')
            .attr('data-type', 'RuleVariant')
            .attr('data-name', this.name);
        var select = $('<select>');
        var item_data = data ? data.item : undefined;
        var selected = data ? data.rule : undefined;
        for (var num in this.static) {
            var item = this.static[num];
            var item_element = item.create(context, item_data)
                .attr('data-variant', this.name);
            select.append(item_element);
        }
        if (notEmpty(this.dynamic)) {
            var holder = $('<div>')
                .attr('data-variant-dynamic-holder', this.name);
            container.append(holder);
            for (var num in this.dynamic) {
                var item = this.dynamic[num];
                var item_element = item.create(context, item_data)
                    .attr('data-variant', this.name);
                select.append(item_element);
            }

            var element = select[0];

            element.container = holder;
            element.rule = this;
            element.context = context;

            select.change(OnSelectDynamicVariantEvent);
            if (item_data && selected in this.dynamic) {
                var selected_item = this.dynamic[selected];
                holder.append(
                    selected_item.variant.create(context, item_data, 
                            selected_item.description)
                        .attr('data-variant-item', this.name)
                );
            }
            holder.addClass(context.styles.rule_variant_item_holder);
        }
        container.prepend(
            select
                .addClass(context.styles.rule_variant_selector)
            );
        select.val(selected);
        return container
            .addClass(context.styles.rule_variant);
    },
    gather: function (context, container) {
        var selector = container.children('select');
        var holder = container.children(
            '[data-variant-dynamic-holder=' + this.name + ']');
        var value_container = holder.children(
            '[data-variant-item=' + this.name + ']');
        return this.all[selector.val()].gather(context, value_container);
    },
    itervariants: function (body) {
        for (var name in this.static) {
            var item = this.static[name];
            try {
                var value = body(name, item);
            } catch (error) {
                continue;
            }
            return value;
        };
        for (var name in this.dynamic) {
            var item = this.dynamic[name];
            try {
                var value = body(name, item);
            } catch (error) {
                continue;
            }
            return value;
        };
        throw 'NotMatchedInVariant';
    },
    markup: function (context, value) {
        var self = this;
        return self.itervariants(function (name, item) {
            var marked_item = item.variant.markup(context, value);
            return {
                type: 'RuleVariant',
                name: self.name,
                rule: name,
                item: marked_item
            };
        });
    }
});




var BaseDTDEditor = Class.$extend({
    __classvars__: {
        defaults: {
            styles: {
                'invalid_input': 'invalid-input',

                'check_value': 'check check-value',
                'check_type': 'check check-type',
                'check_rule': 'check check-rule',
                'check_many': 'check check_many',

                'check_many_item': 'many-item',
                'check_many_item_holder': 'many-item-holder',
                'check_many_remove_btn_holder': 'many-remove-btn-holder',

                'static_tabular_item': 'item item-static-tabular',
                'static_tabular_item_key': 'item-key item-static-tabular-key',
                'static_tabular_item_value': 'item-value item-static-tabular-value',

                'static_simple_item': 'item item-static-simple',
                'static_simple_item_key': 'item-key item-static-simple-key',
                'static_simple_item_value': 'item-value item-static-simple-value',

                'static_plain_item': 'item item-static-plain',
                'static_plain_item_key': 'item-key item-static-plain-key',
                'static_plain_item_value': 'item-value item-static-plain-value',

                'dynamic_plain_item': 'item item-dynamic-plain',
                'dynamic_plain_item_key': 'item-key item-dynamic-plain-key',
                'dynamic_plain_item_value': 'item-value item-dynamic-plain-value',

                'part_static_tabular': 'part part-static-tabular',
                'part_static_plain': 'part part-static-plain',
                'part_dynamic_plain': 'part part-static-plain',

                'dynamic_button_add': 'dynamic-button-add',
                'dynamic_button_remove': 'dynamic-button-remove',

                'dynamic_item_holder': 'dynamic-item-holder',
                'dynamic_item_holder_legend': 'dynamic-item-holder-legend',
                'dynamic_item_wrapper': 'dynamic-item-wrapper',
                'dynamic_item_type_selector': 'dynamic-item-type-selector',
                'dynamic_item_type_option': 'dynamic-item-type-option',

                'rule_collect': 'rule rule-collect',

                'variant_static': 'variant variant-static',

                'rule_variant_selector': 'rule-variant-selector',
                'rule_variant_item_holder': 'rule-variant-item-holder',
                'rule_variant': 'rule rule-variant'
            },
            'add_button_text': '[+]',
            'button_remove_text': '[X]'
        }
    },

    __init__: function (options) {
        this.rules = {};
        this.rules_count = 0;
        this.names = {};
        this.checkers = {};
        this.checkers_count = 0;
        this.uuid = uuid();
        $.extend(true, this, BaseDTDEditor.defaults);
        if (options) {
            $.extend(true, this, options);
        }
    },

    get_checker: function (id) {
        return this.checkers[id];
    },

    get_rule_by_name: function (name) {
        return this.names[name];
    },

    create: function (container, data) {
        if (data) {
            var rule = this.get_rule_by_name(data.name);
        } else {
            var rule = this.root;
        }
        var root_element = rule.create(this, data)
            .attr('data-dtd-root', this.uuid)
        container.append(
            root_element
                .addClass(this.styles.dtd_root)
            );
    },

    gather: function (container) {
        return this.root.gather(this,
            container.find('[data-dtd-root="' + this.uuid + '"]')
            );
    }
});

var MarkedDTDEditor = BaseDTDEditor.$extend({
    __init__: function (dtd_data, options) {
        this.$super(options);
        for(var num in dtd_data.checkers) {
            var checker_data = dtd_data.checkers[num];
            var checker = window[checker_data.cls](this, checker_data)
            this.checkers[checker_data.id] = checker;
            this.checkers_count++;
        }
        for(var num in dtd_data.rules) {
            var rule_data = dtd_data.rules[num];
            var rule = window[rule_data.cls](this, rule_data)
            this.rules[rule_data.id] = rule;
            this.rules_count++;
            this.names[rule_data.name] = rule;
        }
        this.root = this.rules[dtd_data.root];
    }
});

var StandAloneDTDEditor = BaseDTDEditor.$extend({
    __init__: function (dtd_data, options) {
        this.$super(options);
        this.declarations = dtd_data;
        var self = this;
        iteritems(dtd_data, function (name, value) {
            if (!self.match_declaration(name, value)) {
                throw 'Invalid rule declaration. name = ' + name;
            }
        });
        this.root = this.names['FILE'];
    },

    get_description: function (name, key) {
        var description = this.declarations[name + '.' + key];
        if (description == undefined) {
            return {};
        } else {
            return description;
        }
    },

    ruleVariant: function (name, checks) {
        var id = 'rule' + this.rules_count;
        var dynamic = [];
        var static = [];
        var rule_data = {
            id: id,
            name: name,
            cls: "RuleVariant",
            static: static,
            dynamic: dynamic
        };
        for (var num in checks) {
            var item = checks[num][1];
            var variant = {
                variant: item.id,
                name: checks[num][0],
                description: checks[num][2]
            };
            if (item.$class == CheckValue) {
                static.push(variant);
            } else {
                dynamic.push(variant);
            }
        }
        this.rules_count++;
        var rule = window[rule_data.cls](this, rule_data);
        this.rules[id] = rule;
        this.names[name] = rule;
        return rule;
    },

    ruleCollect: function (name, checks) {
        var id = 'rule' + this.rules_count;
        var static_tabular = []
        var static_plain = []
        var dynamic_tabular = []
        var dynamic_plain = []
        var rule_data = {
            id: id,
            name: name,
            cls: "RuleCollect",
            static_tabular: static_tabular,
            static_plain: static_plain,
            dynamic_tabular: dynamic_tabular,
            dynamic_plain: dynamic_plain
        };
        for (var num in checks) {
            var rule_key = checks[num][1];
            var rule_value = checks[num][2];
            var item = {
                name: checks[num][0],
                key: rule_key.id,
                value: rule_value.id,
                key_description: checks[num][3],
                value_description: checks[num][4]
            };
            if (rule_key.required && rule_key.$class == CheckValue) {
                if (rule_value.$class == CheckType) {
                    static_tabular.push(item);
                } else {
                    static_plain.push(item);
                }
            } else {
                dynamic_plain.push(item);
            }
        }

        this.rules_count++;
        var rule = window[rule_data.cls](this, rule_data);
        this.rules[id] = rule;
        this.names[name] = rule;
        return rule;
    },

    match_declaration: function (name, value) {
        if (isArray(value)) {
            var checks = [];
            for (var item in value) {
                item = value[item];
                checks.push([
                    item, this.factory(item),
                    this.get_description(name, item)
                    ]);
            }
            this.rules[name] = this.ruleVariant(name, checks);
            return true;
        }
        if (isObject(value)) {
            if (!any_of_values(value, isObject)) {
                checks = [];
                var self = this;
                iteritems(value, function (k, v) {
                    checks.push([
                        k, self.factory(k), self.factory(v),
                        self.get_description(name, k)
                        ]);
                });
                this.rules[name] = this.ruleCollect(name, checks);
                return true;
            }
            if (all_of_values(value, isObject)) {
                var path = name.split('.');
                if (path.length != 2) {
                    throw 'Invalid description. name = ' + name;
                }
                return true;
            }
            return false;
        }
    },

    checkValue: function (value) {
        var id = 'chk' + this.checkers_count;
        var checker_data = {
            id: id,
            value: value,
            cls: 'CheckValue',
            required: false
        };
        this.checkers_count++;
        var checker = window[checker_data.cls](this, checker_data);
        this.checkers[id] = checker;
        return checker;
    },

    checkMany: function (item) {
        var id = 'chk' + this.checkers_count;
        var checker_data = {
            id: id,
            item: item.id,
            cls: "CheckMany",
            required: false
        };
        this.checkers_count++;
        var checker = window[checker_data.cls](this, checker_data);
        this.checkers[id] = checker;
        return checker;
    },

    checkType: function (type) {
        var id = 'chk' + this.checkers_count;
        var checker_data = {
            id: id,
            type: type,
            cls: "CheckType",
            required: false
        };
        this.checkers_count++;
        var checker = window[checker_data.cls](this, checker_data);
        this.checkers[id] = checker;
        return checker;
    },

    checkRule: function (rule) {
        var id = 'chk' + this.checkers_count;
        var checker_data = {
            id: id,
            rule: rule,
            cls: "CheckRule",
            required: false
        };
        this.checkers_count++;
        var checker = window[checker_data.cls](this, checker_data);
        this.checkers[id] = checker;
        return checker;
    },

    factory: function (string) {
        if (string.constructor != String) {
            return this.checkValue(string);
        }
        if (string[string.length - 1] == '*') {
            return this.checkMany(
                this.factory(string.substr(0, string.length - 1))
                );
        } else if (string[string.length - 1] == '!') {
            var rule = this.factory(string.substr(0, string.length - 1));
            rule.required = true;
            return rule;
        }
        if (string in { 'int': 0, 'bool': 0, 'float': 0, 'str': 0 }) {
            return this.checkType(string);
        }
        if (string in this.declarations) {
            return this.checkRule(string);
        }
        return this.checkValue(string);
    },

    markup: function (data) {
        return this.root.markup(this, data);
    }
});


// _____________________________ HELPERS __________________________________ //


function uuid() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}



function find_item_data(item, data) {
    if(data) {
        for(var num in data.items) {
            var item_data = data.items[num];
            if(item_data.rule == item.id) {
                return item_data;
            }
        }
    }
}



function notEmpty(obj) {
    for(var _ in obj) {
        return true;
    }
    return false;
}



function isSingle(obj) {
    var count = 0;
    for(var _ in obj) {
        count++;
        if(count>1) {
            return false;
        }
    }
    return count==1;
}



function isObject(obj) { 
    return obj != undefined && obj.constructor == Object; 
}



function isArray(obj) {
    return obj != undefined && obj.constructor == Array; 
}



function any_of_values(obj, callback) {
    for(var key in obj) {
        var value = obj[key];
        if(callback(value)) return true;
    }
return false;
}



function all_of_values(obj, callback) {
    for(var key in obj) {
        var value = obj[key];
        if(!callback(value)) return false;
    }
return true;
}



function iteritems(obj, callback) {
    for(var key in obj) {
        var value = obj[key];
        callback(key, value);
    }
}


// ________________________ DYNAMIC CONTENT ________________________________ //

function OnSelectDynamicVariant(element, value, data) {
    element.container.empty();
    var item = element.rule.dynamic[value];
    if(item) {
        element.container.append(
            item.variant.create(element.context, data)
                .attr('data-variant-item', element.rule.name)
        );
    }
}



function OnSelectDynamicVariantEvent() {
    OnSelectDynamicVariant(this, this.value);
}




function OnSelectDynamic(element, value, data) {
    element.container.empty();
    var item = element.rule.dynamic_plain[value];
    element.container.append(
        item.create(element.context, data)
            .attr('data-collect-item', element.rule.name)
    );
}



function OnSelectDynamicEvent() {
    OnSelectDynamic(this, this.value);
}



function AddDynamicElement(rule, context, data) {
    var remove = $('<a href="javascript:;">')
        .click(function() {
            $(this).parents('fieldset').first().remove();
        })
        .addClass(context.styles.dynamic_button_remove);
    remove.text(context.button_remove_text);
    var holder = $('<fieldset>')
        .attr('data-dynamic-helper', 'holder')
        .append(
            $('<legend>')
                .attr('align', "right")
                .append(remove)
                .addClass(context.styles.dynamic_item_holder_legend)
            )
    var dynamic_container = $('<div>')
        .attr('data-dynamic-helper', 'wrapper');
    if(isSingle(rule.dynamic_plain)) {
        for(var num in rule.dynamic_plain) {
            var item = rule.dynamic_plain[num];
            dynamic_container.append(
                item.create(context, data)
                    .attr('data-collect-item', rule.name)
                );
            break;
        }
    } else {
        var select = $('<select>');
        var element = select[0];

        element.container = dynamic_container;
        element.rule = rule;
        element.context = context;

        holder.append(select);
        if(data) {
            var selected = data.rule;
            OnSelectDynamic(element, selected, data);
        }

        select.append(
            $('<option>')
                .addClass(context.styles.dynamic_item_type_option)
            );
        for (var num in rule.dynamic_plain) {
            var item = rule.dynamic_plain[num];
            var option = $('<option>')
                .attr('value', num)
                .text(item.id)
                .addClass(context.styles.dynamic_item_type_option);
            select.append(option);
            if(num == selected) {
                option.attr('selected', 'selected');
                }
        }
        select.change(OnSelectDynamicEvent);
        holder.append(
            select
                .addClass(context.styles.dynamic_item_type_selector)
            );
    }
    holder.append(
        dynamic_container
            .addClass(context.styles.dynamic_item_wrapper)
        );
    return holder
        .addClass(context.styles.dynamic_item_holder);
}



function AddDynamicElementEvent() {
    AddDynamicElement(this.rule, this.context).insertBefore(this);
}

function AddManyItem(checker, context, data) {
    return $('<tr>')
        .attr('data-many-row', true)
        .append(
            $('<td>')
                .addClass('dragable'),
            $('<td>')
                .append(
                    checker.create(context, data, {})
                        .attr('data-many-item', checker.id)
                    )
                .addClass(context.styles.check_many_item_holder),
            $('<td>')
                .append(
                    $('<a>')
                        .attr('href', 'javascript:;')
                        .text(context.button_remove_text)
                        .click(function () {
                            $(this).parents('tr').first().remove();
                        })
                    )
                .addClass(context.styles.check_many_remove_btn_holder)
            )
        .addClass(context.styles.check_many_item);
}

function AddManyItemEvent() {
    AddManyItem(this.checker, this.context)
        .insertBefore($(this).parents('tr').first());
}
