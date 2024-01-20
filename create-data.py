import requests
import datetime
import sys
from dotenv import load_dotenv
import os

# Specify the path to your .env.development file
dotenv_path = os.path.join(os.path.dirname(__file__), '.env.development')
load_dotenv(dotenv_path)

def create_food_item(server_url, token, user_id, food_item_details):
    url = f"{server_url}/api/foodItems"
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    }
    data = {'userId': user_id, **food_item_details}
    response = requests.post(url, json=data, headers=headers)
    return response.json()

def create_meal(server_url, token, user_id, meal_name, food_item_id):
    url = f"{server_url}/api/meals"
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    }
    data = {
        'userId': user_id,
        'name': meal_name,
        'foodEntries': [{'foodItem': food_item_id, 'grams': 100}],
        'isSavedInCollection': True
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()

def add_meal_to_daily_log(server_url, token, user_id, meal_id):
    url = f"{server_url}/api/dailyLogs"
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    }
    today = datetime.datetime.now().strftime('%m%d%Y')
    data = {
        'userId': user_id,
        'date': today,
        'meals': {
            'breakfast': [meal_id],
            'lunch': [],
            'dinner': [],
            'snacks': []
        }
    }
    response = requests.put(url, json=data, headers=headers)
    return response.json()

def main():
    if len(sys.argv) != 3:
        print("Usage: python create-data.py <userId> <token>")
        sys.exit(1)

    server_url = os.getenv('VITE_API_URL')
    user_id = sys.argv[1]
    token = sys.argv[2]

    food_item_details = {
        'name': 'Apple',
        'nutrition': {
            'calories': 52,
            'protein': '0.3g',
            'carbs': '14g',
            'fat': '0.2g',
            'sodium': '1mg'
        },
        'isDefault': False
    }
    meal_name = 'Healthy Breakfast'

    food_item = create_food_item(server_url, token, user_id, food_item_details)
    print(f"Food item created: {food_item}")

    if '_id' in food_item:
        meal = create_meal(server_url, token, user_id, meal_name, food_item['_id'])
        print(f"Meal created: {meal}")

        if '_id' in meal:
            log = add_meal_to_daily_log(server_url, token, user_id, meal['_id'])
            print(f"Meal added to daily log: {log}")
        else:
            print("Meal creation failed. Cannot proceed with adding meal to daily log.")
    else:
        print("Food item creation failed. Cannot proceed with meal creation.")

if __name__ == '__main__':
    main()
