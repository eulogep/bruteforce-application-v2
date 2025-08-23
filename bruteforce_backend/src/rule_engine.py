
class RuleEngine:
    def __init__(self, rules=None):
        self.rules = rules if rules is not None else []

    def apply_rules(self, word):
        transformed_words = {word} # Start with the original word
        current_words = {word}

        for rule in self.rules:
            next_words = set()
            for w in current_words:
                # Simple rule examples (can be expanded)
                if rule == ":capitalize":
                    next_words.add(w.capitalize())
                elif rule == ":uppercase":
                    next_words.add(w.upper())
                elif rule == ":lowercase":
                    next_words.add(w.lower())
                elif rule.startswith(":append_digit:"):
                    try:
                        num_digits = int(rule.split(":")[2])
                        for i in range(10**num_digits):
                            next_words.add(w + str(i).zfill(num_digits))
                    except ValueError:
                        pass
                elif rule.startswith(":prepend_digit:"):
                    try:
                        num_digits = int(rule.split(":")[2])
                        for i in range(10**num_digits):
                            next_words.add(str(i).zfill(num_digits) + w)
                    except ValueError:
                        pass
                # Add more complex rules here (e.g., replace chars, leetspeak, etc.)
                else:
                    # If rule is not recognized, just add the original word
                    next_words.add(w)
            transformed_words.update(next_words)
            current_words = next_words # Apply next rule to newly generated words

        return list(transformed_words)

# Exemple d'utilisation
if __name__ == '__main__':
    engine = RuleEngine(rules=[":capitalize", ":append_digit:2"])
    words = ["test", "password"]
    for word in words:
        print(f"Original: {word}, Transformed: {engine.apply_rules(word)}")

    engine_complex = RuleEngine(rules=[":capitalize", ":uppercase", ":append_digit:1"])
    print(f"Original: password, Transformed: {engine_complex.apply_rules('password')}")


