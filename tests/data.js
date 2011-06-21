var simple_DTD_variant_1 = {
    'FILE': {
        'pack': 'VARIANT*'
    },
    'VARIANT': [
        'RULE1',
        'RULE2'
    ],
    'RULE1': {
        'value': 'int'
    },
    'RULE2': {
        'value': 'str'
    }
}

var simple_data_variant_1 = {
    'pack': [
        { 'value': 1 },
        { 'value': 2 },
    ]
}

var simple_data_variant_2 = {
    'pack': [
        { 'value': 'A' },
        { 'value': 'B' },
    ]
}

var simple_data_variant_3 = {
    'pack': [
        { 'value': 'A' },
        { 'value':  1  },
        { 'value': 'B' },
        { 'value':  2  },
    ]
}

var simple_DTD_variant_2 = {
    'FILE': {
        'pack': 'VARIANT'
    },
    'VARIANT': [
        'RULE1*',
        'RULE2*'
    ],
    'RULE1': {
        'value': 'int'
    },
    'RULE2': {
        'value': 'str'
    }
}

var simple_DTD_variant_3 = {
    'FILE': {
        'pack': 'VARIANT*'
    },
    'VARIANT': [
        'RULE1',
        'RULE2'
    ],
    'RULE1': [
        'int',
        'str',
    ],
    'RULE2': [
        'bool',
        'float',
    ],
}

var simple_data_variant_4 = {
    'pack': [
        1,
        'A',
        true,
        2,
        false,
        5.3,
        'Q',
        1.1,
        0
    ]
}

var simple_DTD_collect_1 = {
    'FILE': {
        'RULE1': 'int'
    },
    'RULE1': [
        'int',
        'str',
    ],
}

var simple_data_collect_1 = {
    'A': 1,
     2 : 2,
     1 : 3,
    'D': 4
}

var simple_DTD_collect_2 = {
    'FILE': {
        'str': 'RULE1'
    },
    'RULE1': [
        'int',
        'RULE2',
    ],
    'RULE2': {
        'value': 'RULE1'
    }
}

var simple_data_collect_2 = {
    'A': 1,
    'B': 2,
    'C': {
        'value': 3
    },
    'D': {
        'value': {
            'value': 4
        }
    }
}

var simple_DTD_tree_1 = {
    'FILE': [
        'NODE'
    ],
    'NODE': {
        'attributes': 'ATTRIBUTES',
        'children': 'CHILDREN'
    },
    'ATTRIBUTES': {
        'str': 'VALUE'
    },
    'VALUE': [
        'str',
        'int',
        'float',
        'bool'
    ],
    'CHILDREN': {
        'str': 'NODE'
    }
}

var simple_data_tree_1 = {
    'attributes': {
        'id': 0,
        'type': 'Window',
        'visible': true,
        'aspect': 4/3,
        'name': 'Dialog'
    },
    'children': {
        'btn_ok': {
            'attributes': {
                'id': 1,
                'type': 'Button',
                'visible': true,
                'text': 'Ok'
            }
        },
        'btn_cancel': {
            'attributes': {
                'id': 2,
                'type': 'Button',
                'visible': true,
                'text': 'Cancel'
            }
        }
    }
}


var complex_DTD_1 = {
    "PAIR1": {
        "value!": "int",
        "name!": "str"
    },
    "FILE": {
        "values!": "VALUES",
        "ban!": "BAN",
        "arrays!": "ARRAYS"
    },
    "REASONS_2": {
        "str!": "REASON_2"
    },
    "REASONS_1": {
        "str!": "REASON_1"
    },
    "REASON_2": {
        "en!": "str",
        "ru!": "str",
        "uk!": "str"
    },
    "BAN": {
        "reasons1!": "REASONS_1",
        "reasons2!": "REASONS_2"
    },
    "LANG": [
        "en",
        "ru",
        "uk",
        "ADDITONAL_LANGUAGES"
    ],
    "REASON_1": {
        "LANG": "str"
    },
    "ADDITONAL_LANGUAGES": [
        "fr",
        "it",
        "str"
    ],
    "ARRAYS": {
        "integer!": "int*",
        "composite1!": "PAIR1*",
        "boolean!": "bool*",
        "floating!": "float*",
        "string!": "str*"
    },
    "VALUES": {
        "integer!": "int",
        "boolean!": "bool",
        "floating!": "float",
        "string!": "str"
    }
};

var complex_data_1 = {
    "ban": {
        "reasons1": {
            "r1": {
                "ru": "r1_ru",
                "en": "r1_en",
                "uk": "r1_uk"
            },
            "r2": {
                "ru": "r2_ru",
                "uk": "r2_uk",
                "op": "opopop"
            },
            "r3": {
                "ru": "r3_ru",
                "en": "r3_en"
            }
        },
        "reasons2": {
            "r1": {
                "ru": "r1_ru",
                "en": "r1_en",
                "uk": "r1_uk"
            },
            "r2": {
                "ru": "r2_ru",
                "uk": "r2_uk"
            },
            "r3": {
                "ru": "r3_ru",
                "en": "r3_en"
            }
        }
    },
    "arrays": {
        "composite1": [
            {
                "name": "A",
                "value": 1
            },
            {
                "name": "B",
                "value": 2
            },
            {
                "name": "C",
                "value": 3
            }
        ],
        "integer": [
            1,
            2,
            3
        ],
        "floating": [
            3.14,
            2.718
        ],
        "boolean": [
            true,
            false,
            true,
            true
        ],
        "string": [
            "A",
            "B",
            "C"
        ]
    },
    "values": {
        "integer": 1,
        "floating": 3.14,
        "boolean": true,
        "string": "test"
    }
};

var complex_DTD_2 = {
    'FILE': {
        'str': 'STYLE'
    },
    'STYLE': {
        'name': 'str',
        'size': 'int',
        'bold': 'bool',
        'italic': 'bool',
        'underline': 'bool',
        'strikeOut': 'bool',
        'family': 'str',
        'color': 'COLOR',
        'background': 'COLOR',
        'align': 'ALIGN',

        'top': 'int',
        'bottom': 'int',
        'left': 'int',
        'right': 'int'
    },
    'COLOR': [
        'str',
        'int'
    ],
    'ALIGN': [
        'Left',
        'Right',
        'Center',
        'Justify'
    ]
};

var complex_data_2_1 = {
    'default': {
        'name': 'Main style',
        'size': 10,
        'align': 'Justify',
        'bottom': 10
    },
    'header2': {
        'name': 'Header 2',
        'bold': true,
        'underline': true,
        'size': 14,
        'align': 'Center',
        'bottom': 20
    },
    'emphasis': {
        'name': 'Emphasis',
        'italic': true
    },
    'list': {
        'name': 'Numbered list',
        'top': 0,
        'bottom': 0,
        'align': 'Justify'
    }
};

var complex_data_2_2 = {
    'google_gg': {
        'name': 'Google Gg',
        'bold': true,
        'color': 'blue'
    },
    'google_oe': {
        'name': 'Google oe',
        'bold': true,
        'color': 'red'
    },
    'google_o': {
        'name': 'Google o',
        'bold': true,
        'color': 'orange'
    },
    'google_l': {
        'name': 'Google l',
        'bold': true,
        'color': 'green'
    }
};

self_check_DTD_DTD = {
    'FILE': {
        'str': 'RULE'
    },
    'RULE': [
        'COLLECTION',
        'str*'
    ],
    'COLLECTION': {
        'str': 'str'
    }
};

self_check_EDTD_DTD = {
    'FILE': {
        'str': 'RULE'
    },
    'RULE': [
        'COLLECTION',
        'str*',
        'DESCRIPTIONS'
    ],
    'COLLECTION': {
        'str': 'str'
    },
    'DESCRIPTIONS': [
        'MAPPING_DESCRIPTION',
        'SEQUENCE_DESCRIPTION'
    ],
    'MAPPING_DESCRIPTION': {
        'key': 'DESCRIPTION',
        'value': 'DESCRIPTION'
    },
    'SEQUENCE_DESCRIPTION': {
        'item': 'DESCRIPTION'
    },
    'DESCRIPTION': {
        'name': 'str',
        'min': 'NUMBER',
        'max': 'NUMBER',
        'max_len': 'int'
    },
    'NUMBER': [
        'int',
        'float'
    ]
};

self_check_DTD_EDTD = {
    "FILE": {
        "str": "RULE"
    },
    "RULE": [
        "COLLECTION",
        "str*"
    ],
    "COLLECTION": {
        "str": "str"
    },
    "RULE.COLLECTION": {
        "item": {
            "name": "\u041a\u043e\u043b\u043b\u0435\u043a\u0446\u0438\u044f"
        }
    },
    "RULE.str*": {
        "item": {
            "name": "\u0412\u0430\u0440\u0438\u0430\u043d\u0442\u044b"
        }
    },
    "COLLECTION.str": {
        "key": {
            "name": "\u0418\u043c\u044f \u043f\u043e\u043b\u044f"
        },
        "value": {
            "name": "\u0422\u0438\u043f \u043f\u043e\u043b\u044f"
        }
    },
    "FILE.str": {
        "key": {
            "name": "\u0418\u043c\u044f \u043f\u0440\u0430\u0432\u0438\u043b\u0430"
        },
        "value": {
            "name": "\u041f\u0440\u0430\u0432\u0438\u043b\u043e"
        }
    }
};

self_check_EDTD_EDTD = {
    "DESCRIPTION.default": {
        "key": {
            "name": "\u0417\u043d\u0430\u0447\u0435\u043d\u0438\u0435 \u043f\u043e \u0443\u043c\u043e\u043b\u0447\u0430\u043d\u0438\u044e"
        }
    },
    "SEQUENCE_DESCRIPTION": {
        "item": "DESCRIPTION"
    },
    "NUMBER": [
        "int",
        "float"
    ],
    "COLLECTION": {
        "str": "str"
    },
    "MAPPING_DESCRIPTION.value": {
        "key": {
            "name": "\u0417\u043d\u0430\u0447\u0435\u043d\u0438\u0435"
        },
        "value": {
            "name": "\u0421\u0432\u043e\u0439\u0441\u0442\u0432\u0430"
        }
    },
    "NUMBER.float": {
        "item": {
            "name": "\u0412\u0435\u0449\u0435\u0441\u0442\u0432\u0435\u043d\u043d\u043e\u0435 \u0447\u0438\u0441\u043b\u043e"
        }
    },
    "DESCRIPTIONS.SEQUENCE_DESCRIPTION": {
        "item": {
            "name": "\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u0432\u0430\u0440\u0438\u0430\u043d\u0442\u043e\u0432"
        }
    },
    "DESCRIPTIONS": [
        "MAPPING_DESCRIPTION",
        "SEQUENCE_DESCRIPTION"
    ],
    "FILE": {
        "str": "RULE"
    },
    "NUMBER.int": {
        "item": {
            "name": "\u0426\u0435\u043b\u043e\u0435 \u0447\u0438\u0441\u043b\u043e"
        }
    },
    "DESCRIPTION.max_len": {
        "key": {
            "name": "\u041c\u0430\u043a\u0441\u0438\u043c\u0430\u043b\u044c\u043d\u0430\u044f \u0434\u043b\u0438\u043d\u043d\u0430"
        }
    },
    "COLLECTION.str": {
        "key": {
            "name": "\u0418\u043c\u044f \u043f\u043e\u043b\u044f"
        },
        "value": {
            "name": "\u0422\u0438\u043f \u043f\u043e\u043b\u044f"
        }
    },
    "DESCRIPTION.min": {
        "key": {
            "name": "\u041c\u0438\u043d\u0438\u043c\u0430\u043b\u044c\u043d\u043e\u0435 \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0435"
        }
    },
    "DESCRIPTION": {
        "default": "object",
        "max_len": "int",
        "min": "NUMBER",
        "name": "str",
        "max": "NUMBER"
    },
    "MAPPING_DESCRIPTION.key": {
        "key": {
            "name": "\u041a\u043b\u044e\u0447"
        },
        "value": {
            "name": "\u0421\u0432\u043e\u0439\u0441\u0442\u0432\u0430"
        }
    },
    "SEQUENCE_DESCRIPTION.item": {
        "key": {
            "name": "\u042d\u043b\u0435\u043c\u0435\u043d\u0442"
        },
        "value": {
            "name": "\u0421\u0432\u043e\u0439\u0441\u0442\u0432\u0430"
        }
    },
    "RULE.str*": {
        "item": {
            "name": "\u0412\u0430\u0440\u0438\u0430\u043d\u0442\u044b"
        }
    },
    "RULE": [
        "COLLECTION",
        "str*",
        "DESCRIPTIONS"
    ],
    "DESCRIPTION.max": {
        "key": {
            "name": "\u041c\u0430\u043a\u0441\u0438\u043c\u0430\u043b\u044c\u043d\u043e\u0435 \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0435"
        }
    },
    "FILE.str": {
        "key": {
            "name": "\u0418\u043c\u044f \u043f\u0440\u0430\u0432\u0438\u043b\u0430"
        },
        "value": {
            "name": "\u041f\u0440\u0430\u0432\u0438\u043b\u043e"
        }
    },
    "RULE.DESCRIPTIONS": {
        "item": {
            "name": "\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435"
        }
    },
    "DESCRIPTIONS.MAPPING_DESCRIPTION": {
        "item": {
            "name": "\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u0441\u043b\u043e\u0432\u0430\u0440\u044f"
        }
    },
    "RULE.COLLECTION": {
        "item": {
            "name": "\u041a\u043e\u043b\u043b\u0435\u043a\u0446\u0438\u044f"
        }
    },
    "DESCRIPTION.name": {
        "key": {
            "name": "\u0418\u043c\u044f"
        }
    },
    "MAPPING_DESCRIPTION": {
        "key": "DESCRIPTION",
        "value": "DESCRIPTION"
    }
}