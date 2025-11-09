import asyncio
import websockets

async def test_ws():
    uri = "ws://localhost:8765"
    async with websockets.connect(uri) as websocket:
        await websocket.send("stop")
        print("Sent stop command")
        await websocket.send("track")
        print("Sent track command")
        await websocket.send("scan")
        print("Sent scan command")

asyncio.run(test_ws())
