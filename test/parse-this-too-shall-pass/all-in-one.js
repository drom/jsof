{
    unquoted_key: "keys must be quoted",
    a1: ["extra comma",],
    a2: ["double extra comma",,],
    // single line comment
    "Illegal expression": 1 + 2,
    "Illegal invocation": alert(),
    "Numbers cannot have leading zeroes": 013,
    "Numbers cannot be hex": 0x14,
    a3: [
        "Illegal backslash escape: \x15",
        "Illegal backslash escape: \017",
        [[[[[[[[[[[[[[[[[[[["Too deep"]]]]]]]]]]]]]]]]]]]],
        "Bad value", truth,
        'single quote',
        /* multi-line comment */
        "	tab	character	in	string	",
        "tab\   character\   in\  string\  ",
        "line\
        break"
    ],
    "Extra comma": true,
}
