valid_characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+-|\"\"')(_*%^#@!?=][{}"

def is_valid_input(inp):
    return all(c in valid_characters for c in inp)

def is_valid_chat_inp(inp):
    return all(c in (valid_characters + " ") for c in inp)
