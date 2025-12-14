# Video Demo Script - WebSocket Midterm Project
**Duration**: ~18 minutes  
**Resolution**: 720p  
**Language**: Vietnamese (or English based on requirement)

---

## Pre-recording Checklist

- [ ] Close unnecessary applications
- [ ] Clear browser cache
- [ ] Prepare 2-3 browser windows/tabs
- [ ] Start server and verify it's running
- [ ] Test microphone audio levels
- [ ] Have script visible on second monitor
- [ ] Prepare code editor with files open

---

## PART 1: Introduction (0:00 - 2:00)

### Opening Screen
**[Show title slide or IDE with project folder]**

**Script:**
> "Xin chào, tôi là [Tên của bạn], sinh viên lớp [Lớp]. Hôm nay tôi sẽ trình bày về đề tài **WebSocket - Giao thức giao tiếp hai chiều real-time** cho bài tiểu luận giữa kỳ môn Lập trình Web với NodeJS."

**[Navigate to project folder in File Explorer]**

> "Dự án của tôi bao gồm một ứng dụng **Real-time Collaborative Cursor Tracking với Chat**, demonstrating các tính năng chính của WebSocket."

### Project Structure Overview
**[Show folder structure]**

> "Cấu trúc dự án gồm:
> - `server.js` - WebSocket server sử dụng Socket.IO
> - `views/index.ejs` - Client-side application
> - `package.json` - Dependencies và scripts
> - `README.md` - Hướng dẫn chi tiết
> - Và báo cáo lý thuyết về WebSocket"

---

## PART 2: Theoretical Background (2:00 - 5:00)

### WebSocket Protocol Explanation
**[Open README.md or report document]**

**Script:**
> "Trước khi demo ứng dụng, tôi sẽ giải thích ngắn gọn về WebSocket protocol."

**[Show diagram if you have one]**

> "WebSocket là một giao thức cung cấp **full-duplex communication channel** qua một kết nối TCP duy nhất. Khác với HTTP request-response, WebSocket cho phép cả client và server gửi dữ liệu độc lập."

### WebSocket vs HTTP
**[Show comparison table from report]**

> "So với HTTP:
> - **Overhead**: WebSocket chỉ ~2 bytes per frame, trong khi HTTP có ~1KB headers
> - **Latency**: WebSocket có latency thấp hơn nhiều do persistent connection
> - **Bidirectional**: WebSocket cho phép 2-way communication real-time"

### Why Socket.IO?
**[Show package.json with dependencies]**

> "Tôi sử dụng Socket.IO vì nó cung cấp:
> - Automatic reconnection
> - Room-based broadcasting
> - Fallback mechanisms
> - Easy-to-use API"

---

## PART 3: Server-side Implementation (5:00 - 8:00)

### Server Code Walkthrough
**[Open server.js in code editor]**

**Script:**
> "Bây giờ chúng ta xem phần server implementation."

**[Scroll to top of server.js]**

> "Đầu tiên, import các thư viện cần thiết: Express, HTTP server, và Socket.IO, cùng với các model `Message` và `User` từ Mongoose."

**[Highlight connection handler]**

> "Đây là WebSocket connection handler. Khi một client kết nối, server lắng nghe các events như:
> - `join-lobby`: User tham gia lobby.
> - `cursor-move`: Synchronize cursor positions.
- `chat-message`: Chat messaging.
> - `disconnect`: User ngắt kết nối."

**[Show `join-lobby` event handler]**

> "Khi user tham gia, server sẽ tìm hoặc tạo mới một `User` trong MongoDB để lấy màu sắc cố định cho user đó. Sau đó, server sẽ tải lịch sử tin nhắn và gửi cho user mới, đồng thời cập nhật danh sách user online cho mọi người."

**[Point out broadcasting logic for `cursor-move`]**

> "Khi nhận được sự kiện `cursor-move`, server broadcast vị trí con trỏ đến tất cả users khác trong cùng lobby bằng `socket.to('Lobby').emit()`. Dữ liệu con trỏ không được lưu vào database để đảm bảo hiệu suất."

**[Point out chat storage]**

> "Tin nhắn chat được lưu vào MongoDB và broadcast đến tất cả mọi người, kèm theo màu sắc của user gửi."

---

## PART 4: Client-side Implementation (8:00 - 11:00)

### Client Code Walkthrough
**[Open views/index.ejs]**

**Script:**
> "Bây giờ xem phần client-side."

**[Show HTML structure]**

> "Giao diện chia làm 2 phần chính:
> - **Cursor area**: Vùng lớn bên trái để theo dõi vị trí con trỏ của mọi người.
> - **Chat panel**: Danh sách người dùng, tin nhắn, và ô nhập liệu."

**[Scroll to JavaScript section]**

> "Phần JavaScript implementation:"

**[Show WebSocket connection]**

> "Client kết nối đến server bằng `io()` - Socket.IO client."

**[Show cursor event emission]**

> "Khi user di chuyển chuột, vị trí được convert sang **relative positions** (0-1), sau đó emit lên server. Điều này giúp vị trí con trỏ hiển thị đúng trên các màn hình có kích thước khác nhau."

**[Show cursor reception]**

> "Khi nhận được `cursor-update` từ server, client sẽ tạo hoặc cập nhật vị trí của con trỏ của user khác trên màn hình, kèm theo tên và màu sắc."

**[Show chat functionality]**

> "Chat messaging cũng tương tự - client emit `chat-message` event, server broadcast đến all users trong lobby. Client sẽ hiển thị tin nhắn với màu sắc tương ứng của người gửi."

---

## PART 5: Live Demo - Single User (11:00 - 13:00)

### Starting the Server
**[Open terminal]**

**Script:**
> "Bây giờ chúng ta start server."

**[Type and run]**
```bash
cd d:\Code\Senior\NodeJs\Midterm
npm start
```

> "Server đang chạy tại port 3000."

### Opening the Application
**[Open browser, navigate to localhost:3000]**

> "Đây là giao diện ứng dụng. Bên trái là khu vực theo dõi con trỏ, bên phải là chat panel."

### Testing Cursor Tracking Features
**[Enter username and join]**

> "Nhập username và join lobby."

**[Move cursor around the cursor area]**

> "Khi tôi di chuyển chuột, vị trí con trỏ của tôi được đánh dấu. Tôi có thể thấy con trỏ của chính mình."

### Testing Chat
**[Send a chat message]**

> "Gửi message: 'Testing chat functionality'. Tin nhắn của tôi hiện ở bên phải với nền xanh và tên có màu được gán."

---

## PART 6: Live Demo - Multi-user Collaboration (13:00 - 17:00)

### Opening Second Browser
**[Open new browser window/tab, position side-by-side]**

**Script:**
> "Bây giờ tôi sẽ demonstrate **real-time collaboration** bằng cách mở một browser window khác."

**[Navigate to localhost:3000 in second window]**

### User 2 Joins
**[In second window, enter different username]**

> "User thứ hai join vào lobby."

**[Watch online users list update]**

> "Nhận thấy danh sách online users được update real-time ở cả hai windows."

### Synchronized Cursors
**[Move cursor in first window]**

> "Khi tôi di chuyển chuột ở window đầu tiên..."

**[Show its cursor appearing in second window with color and name]**

> "...con trỏ xuất hiện ngay lập tức ở window thứ hai với đúng tên và màu sắc. **This is WebSocket in action** - bidirectional, real-time synchronization."

**[Move cursor from second window]**

> "Và ngược lại, khi di chuyển chuột từ window thứ hai, nó sync sang window đầu."

**[Move cursors simultaneously from both windows]**

> "Hai users có thể thấy vị trí con trỏ của nhau đồng thời."

### Chat Between Users
**[Send message from first window]**

> "User 1 gửi message: 'Hello from User 1'. Tên của User 1 có màu riêng."

**[Show it appearing in second window]**

> "Message xuất hiện ngay ở window  User 2."

**[Reply from second window]**

> "User 2 reply: 'Hi User 1! Real-time is awesome!'. User 2 cũng có màu sắc riêng."

**[Show both messages in both windows]**

> "Tất cả messages đều sync perfectly, với màu sắc của username được giữ nguyên."

### Persistent User Color
**[Close the second browser window and rejoin with the same username]**

> "Bây giờ tôi sẽ đóng cửa sổ của User 2 và kết nối lại với cùng một username."

**[Show that User 2 has the same color as before]**

> "Như bạn thấy, User 2 vẫn giữ nguyên màu sắc cũ. Điều này là do màu sắc được lưu trong MongoDB."

---

## PART 7: Code Highlights (17:00 - 18:30)

### Key Technical Points
**[Back to code editor]**

**Script:**
> "Một số điểm kỹ thuật quan trọng trong implementation:"

### 1. Frame Efficiency
**[Show cursor event emission code]**

> "**Performance optimization**: Vị trí con trỏ được throttle và sử dụng relative positions để minimize bandwidth."

### 2. Single Lobby
**[Show server room management code]**

> "**Simplicity**: Chỉ có một lobby duy nhất giúp đơn giản hóa logic và tập trung vào trải nghiệm người dùng."

### 3. Message and User Persistence
**[Show MongoDB models in `models/Message.js`]**

> "**User experience**: Message history và màu sắc của user được lưu vào MongoDB, giúp trải nghiệm liền mạch hơn giữa các phiên làm việc."

### 4. Connection Management
**[Show client reconnection logic]**

> "**Reliability**: Socket.IO tự động reconnect khi mất kết nối."

---

## PART 8: Conclusion (18:30 - 20:00)

### Summary
**[Show application running]**

**Script:**
> "Tóm lại, dự án này đã demonstrate:

> **1. WebSocket Technology:**
> - Full-duplex bidirectional communication
> - Real-time synchronization với minimal latency
> - Event-driven architecture

> **2. Socket.IO Features:**
> - Room-based broadcasting
> - Automatic reconnection
> - Easy integration với Express

> **3. Real-world Application:**
> - Collaborative cursor tracking với multiple users
> - Real-time chat messaging
> - User presence tracking
> - Data persistence với MongoDB"

### Technical Achievement
> "Về mặt kỹ thuật:
> - **Server**: Node.js + Express + Socket.IO
> - **Client**: Vanilla JavaScript
> - **Database**: MongoDB với Mongoose
> - **Architecture**: Event-driven, Single Lobby"

### Learning Outcomes
> "Qua project này, tôi đã:
> - Hiểu sâu về WebSocket protocol
> - Implement real-time features
> - Handle multi-user synchronization
> - Optimize performance và tích hợp database"

### Future Enhancements
> "Có thể mở rộng thêm:
> - User authentication
> - Multiple rooms support
> - Typing indicators
> - User avatars"

### Closing
**[Show README.md]**

> "Toàn bộ source code, documentation, và hướng dẫn cài đặt đều có trong README file."

**[Close with application screenshot]**

> "Cảm ơn các thầy cô đã theo dõi. Đây là demo hoàn chỉnh về WebSocket technology cho bài tiểu luận giữa kỳ. Xin cảm ơn!"

---

## Recording Tips

### Before Recording:
1. **Test audio** - Record 30 seconds to verify audio quality
2. **Close notifications** - Turn on Do Not Disturb mode
3. **Clean desktop** - Remove unnecessary icons
4. **Prepare browser** - Clear history, close extra tabs
5. **Rehearse** - Practice once to get timing right

### During Recording:
1. **Speak clearly** - Not too fast, not too slow
2. **Pause briefly** - Between sections for editing
3. **Zoom in** - When showing code details
4. **Highlight** - Use cursor to point out important parts
5. **Stay calm** - If you make a mistake, pause and continue

### Screen Recording Settings:
- **Resolution**: 1280x720 (720p)
- **Frame Rate**: 30 FPS
- **Audio**: 44.1kHz, stereo
- **Format**: MP4 (H.264 video, AAC audio)

### Recommended Tools:
- **OBS Studio** (Free, professional)
- **Camtasia** (Paid, easy editing)
- **Loom** (Free tier, simple)
- **Windows Game Bar** (Built-in, basic)

### Post-Recording:
1. **Review** - Watch entire video
2. **Edit** - Remove long pauses, mistakes
3. **Add text** - Optionally add captions/titles
4. **Verify quality** - Check resolution is 720p
5. **File size** - Compress if > 500MB

---

## Time Management

| Section | Duration | Total Time |
|---------|----------|------------|
| Introduction | 2:00 | 2:00 |
| Theory | 3:00 | 5:00 |
| Server Code | 3:00 | 8:00 |
| Client Code | 3:00 | 11:00 |
| Single User Demo | 2:00 | 13:00 |
| Multi-user Demo | 4:00 | 17:00 |
| Code Highlights | 1:30 | 18:30 |
| Conclusion | 1:30 | 20:00 |

**Total**: ~20 minutes (under limit)

---

## Backup Script (If Time is Short)

If you need to shorten to 15 minutes:

- Skip detailed code walkthrough (5 min → 2 min)
- Focus more on live demo
- Combine theory with demo
- Reduce conclusion time

---

Good luck with your recording! 🎥🚀