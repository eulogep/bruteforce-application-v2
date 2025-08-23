import os
import requests
from typing import List, Set

class DictionaryManager:
    def __init__(self):
        self.dictionaries = {}
        self.common_dictionaries = {
            "rockyou": "https://github.com/brannondorsey/naive-hashcat/releases/download/data/rockyou.txt",
            "common_passwords": "https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/Common-Credentials/10-million-password-list-top-1000000.txt",
            "french_passwords": "https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/Common-Credentials/french-passwords.txt"
        }

    def load_dictionary_from_file(self, name: str, file_path: str) -> bool:
        """Load dictionary from local file"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                words = [line.strip() for line in f if line.strip()]
            self.dictionaries[name] = words
            return True
        except Exception as e:
            print(f"Error loading dictionary {name}: {e}")
            return False

    def load_dictionary_from_url(self, name: str, url: str) -> bool:
        """Download and load dictionary from URL"""
        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            words = [line.strip() for line in response.text.split('\n') if line.strip()]
            self.dictionaries[name] = words
            return True
        except Exception as e:
            print(f"Error downloading dictionary {name}: {e}")
            return False

    def load_common_dictionary(self, name: str) -> bool:
        """Load a common dictionary by name"""
        if name in self.common_dictionaries:
            return self.load_dictionary_from_url(name, self.common_dictionaries[name])
        return False

    def create_custom_dictionary(self, name: str, words: List[str]) -> bool:
        """Create a custom dictionary from a list of words"""
        try:
            self.dictionaries[name] = list(set(words))  # Remove duplicates
            return True
        except Exception as e:
            print(f"Error creating custom dictionary {name}: {e}")
            return False

    def merge_dictionaries(self, name: str, dict_names: List[str]) -> bool:
        """Merge multiple dictionaries into one"""
        try:
            merged_words = set()
            for dict_name in dict_names:
                if dict_name in self.dictionaries:
                    merged_words.update(self.dictionaries[dict_name])
            self.dictionaries[name] = list(merged_words)
            return True
        except Exception as e:
            print(f"Error merging dictionaries: {e}")
            return False

    def filter_dictionary(self, dict_name: str, min_length: int = 1, max_length: int = 100) -> List[str]:
        """Filter dictionary by word length"""
        if dict_name not in self.dictionaries:
            return []
        
        return [word for word in self.dictionaries[dict_name] 
                if min_length <= len(word) <= max_length]

    def get_dictionary(self, name: str) -> List[str]:
        """Get dictionary by name"""
        return self.dictionaries.get(name, [])

    def list_dictionaries(self) -> List[str]:
        """List all loaded dictionaries"""
        return list(self.dictionaries.keys())

    def get_dictionary_stats(self, name: str) -> dict:
        """Get statistics about a dictionary"""
        if name not in self.dictionaries:
            return {}
        
        words = self.dictionaries[name]
        if not words:
            return {"count": 0}
        
        lengths = [len(word) for word in words]
        return {
            "count": len(words),
            "min_length": min(lengths),
            "max_length": max(lengths),
            "avg_length": sum(lengths) / len(lengths),
            "unique_words": len(set(words))
        }

    def save_dictionary_to_file(self, name: str, file_path: str) -> bool:
        """Save dictionary to file"""
        if name not in self.dictionaries:
            return False
        
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                for word in self.dictionaries[name]:
                    f.write(word + '\n')
            return True
        except Exception as e:
            print(f"Error saving dictionary {name}: {e}")
            return False

    def generate_personal_dictionary(self, personal_info: dict) -> List[str]:
        """Generate a personalized dictionary based on personal information"""
        words = []
        
        # Basic personal info
        if 'name' in personal_info:
            words.extend([personal_info['name'], personal_info['name'].lower(), personal_info['name'].capitalize()])
        
        if 'surname' in personal_info:
            words.extend([personal_info['surname'], personal_info['surname'].lower(), personal_info['surname'].capitalize()])
        
        if 'birthdate' in personal_info:
            # Add various date formats
            date = personal_info['birthdate']
            words.extend([date, date.replace('-', ''), date.replace('/', ''), date[-4:]])  # Year only
        
        if 'company' in personal_info:
            words.extend([personal_info['company'], personal_info['company'].lower()])
        
        if 'pet_name' in personal_info:
            words.extend([personal_info['pet_name'], personal_info['pet_name'].lower()])
        
        # Common combinations
        if 'name' in personal_info and 'birthdate' in personal_info:
            year = personal_info['birthdate'][-4:]
            words.extend([
                personal_info['name'] + year,
                personal_info['name'].lower() + year,
                year + personal_info['name'].lower()
            ])
        
        # Add common password patterns
        common_suffixes = ['123', '1234', '12345', '!', '@', '#', '2023', '2024']
        base_words = words.copy()
        for word in base_words:
            for suffix in common_suffixes:
                words.append(word + suffix)
        
        return list(set(words))  # Remove duplicates

# Exemple d'utilisation
if __name__ == '__main__':
    manager = DictionaryManager()
    
    # Create a small test dictionary
    test_words = ["password", "123456", "admin", "test", "qwerty"]
    manager.create_custom_dictionary("test", test_words)
    
    print("Dictionaries:", manager.list_dictionaries())
    print("Test dictionary stats:", manager.get_dictionary_stats("test"))
    
    # Generate personal dictionary
    personal_info = {
        "name": "John",
        "surname": "Doe",
        "birthdate": "1990-05-15",
        "company": "TechCorp"
    }
    
    personal_dict = manager.generate_personal_dictionary(personal_info)
    manager.create_custom_dictionary("personal", personal_dict)
    
    print("Personal dictionary:", personal_dict[:10])  # Show first 10 words
    print("Personal dictionary stats:", manager.get_dictionary_stats("personal"))

