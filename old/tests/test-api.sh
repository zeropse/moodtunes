#!/bin/bash

echo "🧪 Testing MoodTunes API Endpoints"
echo "=================================="

# Test mood analysis API
echo ""
echo "1. Testing Mood Analysis API"
echo "----------------------------"

# Test happy mood
echo "Testing happy mood..."
curl -X POST http://localhost:3000/api/analyze-mood \
  -H "Content-Type: application/json" \
  -d '{"moodText": "I am feeling absolutely amazing and happy today!"}' \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || echo "Response received (jq not available for formatting)"

echo ""

# Test sad mood
echo "Testing sad mood..."
curl -X POST http://localhost:3000/api/analyze-mood \
  -H "Content-Type: application/json" \
  -d '{"moodText": "I am feeling really sad and heartbroken"}' \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || echo "Response received"

echo ""

# Test energetic mood
echo "Testing energetic mood..."
curl -X POST http://localhost:3000/api/analyze-mood \
  -H "Content-Type: application/json" \
  -d '{"moodText": "I am so pumped up and energetic, ready to workout!"}' \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || echo "Response received"

echo ""

# Test edge cases
echo "Testing edge cases..."

# Empty input
echo "Empty input:"
curl -X POST http://localhost:3000/api/analyze-mood \
  -H "Content-Type: application/json" \
  -d '{"moodText": ""}' \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || echo "Response received"

echo ""

# Too short input
echo "Too short input:"
curl -X POST http://localhost:3000/api/analyze-mood \
  -H "Content-Type: application/json" \
  -d '{"moodText": "ok"}' \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || echo "Response received"

echo ""

# Very long input
echo "Very long input:"
LONG_TEXT="I am feeling really happy and excited and amazing and wonderful and fantastic and great and awesome and brilliant and perfect and beautiful and joyful and elated and euphoric and delighted and thrilled and ecstatic and blissful and upbeat and positive and good and excellent and cheerful and celebrating and having the best day ever and feeling like I am on top of the world and everything is going perfectly and I could not be happier right now and life is absolutely incredible and amazing and I want to dance and sing and celebrate this wonderful feeling that I have right now because it is just so perfect and beautiful and I am grateful for everything in my life and feeling blessed and lucky and successful and proud and confident and strong and powerful and unstoppable and ready to conquer anything that comes my way because I am feeling so incredibly positive and optimistic and hopeful about the future and everything that is going to happen"

curl -X POST http://localhost:3000/api/analyze-mood \
  -H "Content-Type: application/json" \
  -d "{\"moodText\": \"$LONG_TEXT\"}" \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || echo "Response received"

echo ""
echo "=================================="
echo "2. Testing Song Suggestions API"
echo "=================================="

# Test song suggestions (this will fail without auth, but we can test the endpoint)
echo "Testing song suggestions (without auth - should return 401)..."
curl -X POST http://localhost:3000/api/suggest-songs \
  -H "Content-Type: application/json" \
  -d '{"mood": "happy", "genres": ["pop", "dance", "funk"]}' \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || echo "Response received"

echo ""
echo "🎯 API Tests Complete!"