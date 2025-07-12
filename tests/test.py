import asyncio
import httpx
import random
import string

API_URL = "http://localhost:8000/api/signup"

def random_string(length=8):
    return ''.join(random.choices(string.ascii_letters, k=length))

def random_password():
    return 'A' + random_string(6) + '1'

async def make_request(client, i):
    payload = {
        "fullName": f"User{i}",
        "email": f"user{i}@example.com",
        "password": random_password(),
        "confirmPassword": random_password(),  # intentionally wrong
        "phoneNumber": 1000000000 + i,
        "country": "India",
        "state": "Maharashtra",
        "city": "Pune"
    }
    
    # To make sure password == confirmPassword
    payload["confirmPassword"] = payload["password"]

    try:
        response = await client.post(API_URL, json=payload)
        print(f"[{i}] Status: {response.status_code}, Response: {response.json()}")
    except Exception as e:
        print(f"[{i}] Error: {e}")

async def main():
    async with httpx.AsyncClient() as client:
        tasks = []
        for i in range(100):
            tasks.append(make_request(client, i))
            await asyncio.sleep(0.0)  # ~100 requests / 60 sec
        await asyncio.gather(*tasks)

if __name__ == "__main__":
    asyncio.run(main())

