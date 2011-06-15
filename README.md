jdtd
====

Dynamic forms generator and validator.

About
-----

Generates HTML form unsing DTD like JSON data structure descriptions.
Forms could contain compound elements like: lists, collections, variative content.


License
-------

See `LICENSE` file.

> Copyright (c) 2011 Eugene Chernyshov

Why?
----

It is usefull when:

 - you need to manage a lot of data and don't have much time to make pretty editor for each custom part;
 - you need to make prototype and don't concern of details;
 - the statement of your work need to be just working (like administrative page of site);
 - you use a lot (or only) `JSON` (`YAML` fits as well) data. When you're using `CouchDB` or `MongoDB` you can even store DTD in some collection of your database.

Getting started
---------------

**1. Make DTD.** 
There is no special format or language for DTD structure. 
It is `JSON` with special data.
Here is simple addressbook example below.

    var AddressBookDTD = {
        'FILE': {
            'contacts': 'PERSON*'
        },
        'PERSON': {
            'name': 'str',
            'id': 'int',
            'email': 'str',
            'phone': 'PHONE*'   
        },
        'PHONE': {
            'number': 'str',
            'type': 'TYPE'
        },
        'TYPE': [
            'MOBILE',
            'HOME',
            'WORK'
        ]
    };

The data could be handled by editor is represented by `FILE` rule.

**2. Create editor instance.**

    var editor = StandAloneDTDEditor(AddressBookDTD);

Actually there are two types of editors in `jdtd`: `StandAloneDTDEditor` and `MarkedDTDEditor`.
`MarkedDTDEditor` is used together with server side part so we'll discuss it later.

**3. Obtain initial data.** 
For our address book it should be something like that.

    var data = {        
        'contacts': [
                {
                'name': 'Bob',
                'id': 1,
                'email': 'bob.bobovan@gmail.com',
                'phone': [
                        {
                        'number': '555-47-72',
                        'type': 'WORK'
                        }
                    ]
                },
                {
                'name': 'James',
                'id': 2,
                'email': 'jamie@gmail.com',
                'phone': [
                        {
                        'number': '555-11-54',
                        'type': 'WORK'
                        },
                        {
                        'number': '555-24-33',
                        'type': 'HOME'
                        }
                    ]
                }
            ]
        };

**4. Mark the data.** 
Here Editor will search all combinations of rules to find exact for all data parts to some rule.

    var marked_data = editor.markup(data);

This operation returns something like parsing tree. 
It is very handy for futher creating editor elements when there is no time to guess but to create.

**5. Create editor elements.** 
Now you need some place on page where editor is about to be created. 
Let this place have id `container`.

    editor.create($('#container'), marked_data);

Now everything is ready to use. You can begin to edit your data. 
**However** it loooks very bad, like huge ugly mess of fields. 
But this is just "Hello world" example. 
After styling and adding additional information into DTD it will be much better.

**6. Storing.** 
When you feel accomplished about editing it is time to retrieve data from editors.
Fortunately, that is simpliest operation.

    editor.gather($('#container'));

It returns data in original format (not marked, ready to use, pure data).

Coming soon.
------------

 - **Styling.** `jdtd` editor has several methods to customize its appearance.
 - **More tests.** That is hard to make full coverage. Maybe I'll only manage with some real world examples.
 - **Site with examples.** Since I don't need server side, GitHub pages is good for small page with few examples and playground.
 - **Descriptions.** Will show how to make not ugly names for fields in editor.