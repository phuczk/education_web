# 📚 GREEN CLASS - DOCUMENTATION CHI TIẾT HỆ THỐNG

## 🏗️ CẤU TRÚC DỰ ÁN

```
education_web/
├── index.html                    # Trang chủ đơn giản
├── pages/                       # Thư mục chính các trang
│   ├── auth/                   # Xác thực người dùng
│   │   ├── login.html           # Đăng nhập
│   │   ├── register.html        # Đăng ký
│   │   └── auth_script.js      # Logic xử lý auth
│   ├── dashboard/               # Trang dashboard chính
│   │   ├── index.html          # Dashboard UI
│   │   └── index_script.js     # Dashboard logic
│   ├── profile/                # Quản lý profile người dùng
│   │   ├── profile.html        # Profile chính
│   │   ├── profile_script.js    # Profile logic
│   │   ├── detail/            # Các trang con của profile
│   │   │   ├── pet/          # Hệ thống thú cưng
│   │   │   │   ├── pet.html
│   │   │   │   └── pet_script.js
│   │   │   ├── chat/         # Chat system
│   │   │   │   ├── index.html
│   │   │   │   └── script.js
│   │   │   └── profile_detail/ # Chi tiết profile
│   │   │       ├── profile_detail.html
│   │   │       └── profile_detail_script.js
│   │   ├── free_source/        # Nguồn học tập miễn phí
│   │   │   ├── flash_card/   # Flashcard học từ vựng
│   │   │   │   ├── index.html
│   │   │   │   └── script.js
│   │   │   ├── typing/       # Luyện gõ phím
│   │   │   │   ├── typing.html
│   │   │   │   └── typing_script.js
│   │   │   ├── speak/        # Luyện nói
│   │   │   │   ├── speak.html
│   │   │   │   └── speak.js
│   │   │   └── speak_test/   # Test nói
│   │   │       ├── speak.html
│   │   │       └── speak_script.js
│   │   └── emoji/             # Emoji reactions
│   │       ├── emoji.html
│   │       └── emoji.js
│   ├── courses/                # Quản lý khóa học
│   │   ├── courses.html        # Danh sách khóa học
│   │   ├── sourses_script.js   # Logic courses
│   │   └── detail/            # Chi tiết khóa học
│   │       ├── sources_detail.html
│   │       └── source_detail_script.js
│   ├── forum/                 # Diễn đàn học tập
│   │   ├── forum.html          # Forum chính
│   │   ├── forum_script.js     # Forum logic
│   │   └── detail/            # Chi tiết bài viết
│   │       ├── forum_detail.html
│   │       └── forum_detail_script.js
│   ├── instructors/            # Giảng viên
│   │   ├── instructors.html     # Danh sách giảng viên
│   │   ├── instructors_script.js # Logic giảng viên
│   │   └── detail/            # Chi tiết giảng viên
│   │       ├── instructors_detail.html
│   │       └── instructors_detail_script.js
│   └── contact/               # Liên hệ
│       ├── contact.html        # Form liên hệ
│       └── contact_script.js   # Logic liên hệ
├── data/                      # Dữ liệu tĩnh
│   ├── const/                 # Constants
│   │   └── api.js            # API endpoints
│   └── image/                # Hình ảnh assets
│       ├── header/            # Header images
│       ├── pets/             # Pet images
│       └── ...
└── style/                     # CSS chung
    └── style.css             # Global styles
```

---

## 🔐 HỆ THỐNG XÁC THỰC (AUTHENTICATION)

### 📍 File: `pages/auth/auth_script.js`

#### **Chức năng chính:**
- **Đăng ký người dùng mới**
  - Tạo account với username, password
  - Kiểm tra trùng lặp username
  - Lưu vào MockAPI
  - Tạo sourcesId array rỗng

- **Đăng nhập người dùng**
  - Xác thực username/password
  - Lưu userId vào localStorage
  - Redirect đến dashboard

#### **API Endpoint:**
```
https://681eeb44c1c291fa66357959.mockapi.io/api/v2/greenclass/users
```

#### **Data Structure:**
```json
{
  "userName": "string",
  "password": "string", 
  "sourcesId": ["array"],
  "coins": 0,
  "streak": 0,
  "avatar": "string",
  "currentPets": ["array"],
  "ownedPets": ["array"]
}
```

---

## 🏠 DASHBOARD TRANG CHỦ

### 📍 File: `pages/dashboard/index.html`

#### **Chức năng chính:**
- **Header với thông tin liên hệ**
  - Phone: 0923266704
  - Social links: Facebook, YouTube, Instagram
  - Login/Register navigation

- **Layout responsive**
  - Cloud và sun animations
  - Green class branding
  - Modern gradient backgrounds

---

## 👤 HỆ THỐNG PROFILE NGƯỜI DÙNG

### 📍 File: `pages/profile/profile.html` & `profile_script.js`

#### **Chức năng chính:**

**1. 📊 Thông tin cá nhân:**
- **Avatar động**: Tự động tạo avatar ngẫu nhiên
  - 10+ tùy chọn: hairstyle, accessories, clothes, colors
  - Dùng Avataaars.io API
  - Random mỗi lần load

- **User Statistics:**
  - **Streak counter**: Đếm ngày học liên tiếp
  - **Coin balance**: Hiển thị số coin hiện có
  - **Courses progress**: Danh sách khóa học đã đăng ký

**2. 🐾 Hệ thống Thú cưng (Pet System):**
- **Pet Shop**: 14 loại pet với giá khác nhau (50-250 coins)
- **Pet Management**:
  - **Current Pets**: Hiển thị pet đang active
  - **Owned Pets**: Danh sách pet đã sở hữu
  - **Buy/Sell**: Mua bán pet với coin

- **Pet Data Structure:**
```javascript
{ id: 1, name: "Fluffy Cat", cost: 100, image: "row-1-column-1.png" }
```

**3. 🪙 Coin System:**
- **Kiếm coin**: Hoàn thành bài học, lesson
- **Tiêu coin**: Mua pet, items
- **Sync**: Đồng bộ giữa các trang

#### **API Integration:**
```javascript
// User API
https://681eeb44c1c291fa66357959.mockapi.io/api/v2/greenclass/users

// Learning Sources API  
https://681eeb44c1c291fa66357959.mockapi.io/api/v2/greenclass/sourses
```

---

## 🎓 NGUỒN HỌC TẬP MIỄN PHÍ (FREE SOURCES)

### 📍 Thư mục: `pages/profile/free_source/`

#### **1. 📇 Flashcard System** (`flash_card/`)

**Chức năng:**
- **Single Card Display**: Hiển thị 1 flashcard tại thời điểm
- **Navigation**: Previous/Next buttons với slide animations
- **Shuffle Algorithm**: Fisher-Yates shuffle random order
- **API Integration**: Load từ speaklearn API
- **Card Counter**: "Card X of Y" display

**Data Mapping:**
```javascript
// API → Flashcard
word → question
answer → answer
```

**API Endpoint:**
```
https://682dcaf54fae1889475791ed.mockapi.io/api/v2/speaklearn/word
```

**Features:**
- ✅ Read-only mode (không thể thêm/sửa/xóa)
- ✅ Slide animations (left/right)
- ✅ Modern gradient UI
- ✅ Responsive design
- ✅ Card flip để xem answer

---

#### **2. ⌨️ Typing Practice** (`typing/`)

**Chức năng:**
- **Word Practice**: Luyện gõ từ vựng tiếng Anh
- **Real-time Validation**: Kiểm tra lỗi gõ ngay lập tức
- **Statistics Tracking**:
  - WPM (Words Per Minute)
  - Accuracy rate
  - Streak counter
- **Time Management**: Đếm ngược thời gian
- **Word Usage**: Theo dõi từ đã luyện tập

**API Integration:**
```javascript
// Load words từ same API với flashcard
wordsFromAPI = data.map(item => item.word);
```

**Features:**
- ✅ Random word selection
- ✅ Mistake tracking
- ✅ Time pressure
- ✅ Progress statistics

---

#### **3. 🎤 Speaking Practice** (`speak/` & `speak_test/`)

**Chức năng:**
- **Voice Recording**: Ghi âm người dùng nói
- **Pronunciation Practice**: Luyện phát âm
- **Audio Playback**: Nghe lại bản ghi
- **Test Mode**: Kiểm tra phát âm
- **Progress Tracking**: Theo dõi tiến độ

**Features:**
- ✅ Microphone access
- ✅ Audio recording
- ✅ Waveform visualization
- ✅ Save/Load recordings

---

## 📚 HỆ THỐNG KHÓA HỌC (COURSES)

### 📍 File: `pages/courses/`

#### **Chức năng chính:**

**1. 📋 Course Management:**
- **Course Listing**: Hiển thị danh sách khóa học
- **Course Categories**: Phân loại theo level/chủ đề
- **Enrollment**: Đăng ký khóa học
- **Progress Tracking**: Theo dõi tiến độ học

**2. 📖 Course Details:**
- **Lesson Structure**: Bài học theo từng phần
- **Content Display**: Video, text, quiz
- **Completion Tracking**: Đánh dấu hoàn thành
- **Certificate**: Tạo chứng chỉ khi hoàn thành

**3. 🎯 Learning Integration:**
- **Coin Rewards**: Tặng coin khi hoàn thành lesson
- **Streak Updates**: Cập nhật streak hàng ngày
- **Profile Sync**: Đồng bộ với profile user

---

## 💬 DIỄN ĐÀN HỌC TẬP (FORUM)

### 📍 File: `pages/forum/`

#### **Chức năng chính:**

**1. 📝 Forum Management:**
- **Topic Creation**: Tạo chủ đề mới
- **Post Management**: Đăng bài viết
- **Category System**: Phân loại chủ đề
- **Search & Filter**: Tìm kiếm bài viết

**2. 💬 Interaction Features:**
- **Comment System**: Bình luận bài viết
- **Like/React**: Thích/bày tỏ cảm xúc
- **User Mentions**: Tag người dùng khác
- **Notification**: Thông báo tương tác

**3. 👥 Community Features:**
- **User Profiles**: Hiển thị thông tin thành viên
- **Reputation System**: Điểm uy tín dựa trên hoạt động
- **Moderation Tools**: Quản lý nội dung
- **Trending Topics**: Chủ đề nóng

---

## 👨‍🏫 HỆ THỐNG GIẢNG VIÊN (INSTRUCTORS)

### 📍 File: `pages/instructors/`

#### **Chức năng chính:**

**1. 👨‍🏫 Instructor Directory:**
- **Instructor Listing**: Danh sách giảng viên
- **Profile Cards**: Hiển thị thông tin cơ bản
- **Specialization**: Lĩnh vực chuyên môn
- **Rating System**: Đánh giá chất lượng giảng dạy

**2. 📋 Instructor Details:**
- **Full Profile**: Thông tin chi tiết giảng viên
- **Course List**: Các khóa học đang dạy
- **Schedule**: Lịch dạy học
- **Contact Options**: Liên hệ giảng viên

**3. 🏆 Instructor Features:**
- **Verification Badge**: Xác thực danh tính
- **Experience Points**: Điểm kinh nghiệm
- **Student Reviews**: Đánh giá từ học viên
- **Achievement Badges**: Huy hiệu thành tích

---

## 🎨 HỆ THỐNG GIAO DIỆN (UI/UX)

### **Design System:**

**1. 🎨 Color Palette:**
- **Primary**: Green (#2E5077) - Education theme
- **Secondary**: Blue (#A5BFCC) - Trust & professional
- **Accent**: Purple gradients - Modern & engaging
- **Background**: Light gradients (#fdfbfb → #ebedee)

**2. 📱 Responsive Design:**
- **Mobile-first**: Tối ưu cho thiết bị di động
- **Breakpoints**: 400px, 600px, 700px
- **Flexible Layouts**: Grid, Flexbox
- **Touch-friendly**: Large tap targets

**3. ✨ Animations & Interactions:**
- **Micro-interactions**: Hover effects, transitions
- **Page Transitions**: Smooth navigation
- **Loading States**: Skeleton screens, spinners
- **Error States**: User-friendly error messages

**4. 🌟 Modern Features:**
- **Glass Morphism**: Backdrop blur effects
- **Gradient Overlays**: Modern color combinations
- **Card-based Layout**: Clean, organized content
- **Dark Mode Support**: (nếu có)

---

## 🔗 KẾT NỐI API INTEGRATION

### **MockAPI Endpoints:**

**1. 🧑 User Management:**
```javascript
// Base URL
https://681eeb44c1c291fa66357959.mockapi.io/api/v2/greenclass

// Endpoints
GET    /users              # Lấy danh sách users
GET    /users/{id}         # Lấy user cụ thể
POST   /users              # Tạo user mới
PUT    /users/{id}         # Cập nhật user
DELETE /users/{id}         # Xóa user
```

**2. 📖 Learning Content:**
```javascript
// Sources API
https://681eeb44c1c291fa66357959.mockapi.io/api/v2/greenclass/sourses

// Words API (Flashcard/Typing)
https://682dcaf54fae1889475791ed.mockapi.io/api/v2/speaklearn/word
```

### **Data Flow:**

**1. 🔐 Authentication Flow:**
```
Login → Validate → Store userId → Redirect Dashboard
Register → Check duplicate → Create user → Auto-login
```

**2. 📚 Learning Flow:**
```
Select Course → Access Lessons → Complete → Earn Coins → Update Streak
```

**3. 🐾 Pet System Flow:**
```
View Shop → Select Pet → Check Coins → Purchase → Update Profile
```

---

## 🛠️ TECHNICAL ARCHITECTURE

### **Frontend Stack:**
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with animations
- **JavaScript ES6+**: Modern JS features
- **jQuery**: DOM manipulation & AJAX
- **Responsive**: Mobile-first design

### **Key Libraries:**
- **Google Fonts**: DynaPuff, Ubuntu, Fredoka
- **Material Icons**: Google Material Symbols
- **Avataaars**: Avatar generation API
- **MockAPI**: Backend simulation

### **Data Storage:**
- **MockAPI**: Primary data storage
- **LocalStorage**: Session management (userId, preferences)
- **Session Storage**: Temporary data

### **Performance Optimizations:**
- **Lazy Loading**: Images & content
- **Debouncing**: Search & input handlers
- **Caching**: API responses
- **Minification**: CSS/JS files

---

## 🚀 FUTURE ENHANCEMENTS

### **Potential Improvements:**

**1. 🔒 Security:**
- JWT authentication
- Input validation & sanitization
- XSS protection
- CSRF tokens

**2. 📈 Analytics:**
- Learning progress tracking
- User behavior analytics
- Performance metrics
- A/B testing

**3. 🌐 Internationalization:**
- Multi-language support
- RTL language support
- Currency localization
- Cultural adaptations

**4. 📱 PWA Features:**
- Offline functionality
- Push notifications
- App installation
- Background sync

---

## 📞 CONTACT INFORMATION

### **Support Channels:**
- **Phone**: 0923266704
- **Facebook**: https://www.facebook.com/tienganhchobe99
- **YouTube**: https://www.youtube.com/@AlokiddyKSC  
- **Instagram**: https://www.instagram.com/2tuanhocthumienphitienganh/

---

## 📝 SUMMARY

Green Class là một nền tảng học tiếng Anh toàn diện với:

✅ **Hệ thống xác thực** hoàn chỉnh  
✅ **Profile management** với pet system  
✅ **Free learning resources** đa dạng  
✅ **Course management** chuyên nghiệp  
✅ **Forum cộng đồng** sôi nổi  
✅ **Instructor directory** chất lượng  
✅ **Modern UI/UX** responsive  
✅ **API integration** đồng bộ  
✅ **Gamification** với coin & streak  

**Mục tiêu**: Cung cấp trải nghiệm học tiếng Anh hiệu quả, thú vị và miễn phí cho người dùng Việt Nam.
