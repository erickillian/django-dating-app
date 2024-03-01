import json


# Function to load, sort, and save data from a JSON file with improved deduplication
def load_sort_save_json_enhanced(file_path):
    try:
        with open(file_path, "r") as file:
            data = json.load(file)
            # Create a set for case-insensitive comparison without altering original text
            seen = set()
            deduped_data = []
            for item in data:
                # Prepare item for comparison: lowercase, but preserve original item for addition
                compare_item = item.lower().strip()
                if compare_item not in seen:
                    seen.add(compare_item)
                    deduped_data.append(item)

            # Sort while preserving original case
            sorted_deduped_data = sorted(deduped_data, key=lambda x: x.lower())

        with open(file_path, "w") as file:
            json.dump(sorted_deduped_data, file, indent=4)

        return True
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False


# File paths
interests_file_path = "./interests.json"
# Assumption: Correct prompts file path will be provided or exist for the next run
prompts_file_path = "./prompts.json"

# Applying the enhanced sorting and deduplication function to both files
sort_interests_success = load_sort_save_json_enhanced(interests_file_path)
sort_prompts_success = load_sort_save_json_enhanced(prompts_file_path)

if sort_interests_success:
    print("Interests sorted and saved successfully")
else:
    print("Error sorting and saving interests")

if sort_prompts_success:
    print("Prompts sorted and saved successfully")
else:
    print("Error sorting and saving prompts")
