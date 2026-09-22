/**
 * CẤU HÌNH THÔNG TIN CHO WEBSITE QUÀ TẶNG SINH NHẬT
 * Bạn có thể tự do chỉnh sửa các thông tin bên dưới để cá nhân hóa cho người yêu của mình.
 */
const BIRTHDAY_CONFIG = {
    // 1. Thông tin người nhận & người gửi
    recipient: {
        name: "Yến Ngân",                  // Tên của người yêu
        nickname: "Cá kho ngọt",           // Biệt danh thân mật
        birthdayDate: "23 Tháng 09",       // Ngày sinh nhật
    },
    sender: {
        name: "Quốc Khánh",                // Cách xưng hô của bạn
        signature: "Người dth nhất trường BS&US ❤️"
    },

    // 2. Màn 1: Hộp quà bất ngờ
    giftBox: {
        badge: "Special Gift For You ✨",
        title: "Một bất ngờ ngọt ngào dành riêng cho em...",
        tapHint: "Chạm vào hộp quà để mở điều bí mật bên trong nhé 🎁",
        openPrompt: "Mở quà ngay"
    },

    // 3. Màn 2: Bánh sinh nhật & Thổi nến
    cake: {
        title: "Happy Birthday My Love! 🎂",
        subtitle: "Tuổi mới luôn rạng rỡ, xinh đẹp và hạnh phúc em nhé!",
        topImage: "assets/images/portrait.jpeg", // Ảnh chân dung tròn trên đỉnh bánh
        // 10 ảnh photo-1 đến photo-10 hiển thị riêng biệt vòng quanh 2 tầng bánh sinh nhật:
        photos: [
            "assets/images/photo-1.jpeg",
            "assets/images/photo-2.jpeg",
            "assets/images/photo-3.jpeg",
            "assets/images/photo-4.jpeg",
            "assets/images/photo-5.jpeg",
            "assets/images/photo-6.jpeg",
            "assets/images/photo-7.jpeg",
            "assets/images/photo-8.jpeg",
            "assets/images/photo-9.jpeg",
            "assets/images/photo-10.jpeg"
        ],
        instruction: "Hãy nhắm mắt lại 3 giây, ước một điều ước thật đẹp rồi nhấn hoặc thổi nến nha! ✨",
        blowButtonText: "Thổi nến sinh nhật 🕯️",
        wishGrantedTitle: "🎉 Chúc Mừng Sinh Nhật Em! 🎉",
        wishGrantedSubtitle: "Mọi điều ước của em chắc chắn sẽ trở thành hiện thực!",
        nextButtonText: "Đọc bức thư anh viết gửi em 💌"
    },

    // 4. Màn 3: Bức thư tình máy gõ chữ (Typewriter)
    letter: {
        stamp: "23.09 Special Delivery",
        title: "Gửi người con gái anh yêu thương nhất,",
        paragraphs: [
            "Hôm nay là một ngày vô cùng đặc biệt — ngày mà thế giới này đón chào một thiên thần nhỏ đáng yêu và dịu dàng, chính là em.",
            "Cảm ơn em đã xuất hiện và mang đến cho cuộc sống của anh thật nhiều nụ cười, sự ấm áp và những khoảnh khắc ngọt ngào không gì sánh bằng.",
            "Bước sang tuổi mới, anh chúc cho công chúa của anh luôn luôn xinh đẹp, ngập tràn niềm vui, công việc thuận lợi và lúc nào cũng được yêu thương trọn vẹn nhất.",
            "Dù sau này cuộc sống có trải qua bao nhiêu mùa sinh nhật nữa, anh vẫn muốn là người đầu tiên thắp nến và nắm chặt tay em bước qua từng năm tháng bình yên.",
            "Chúc mừng sinh nhật em yêu! Yêu em nhiều hơn tất cả những gì anh có thể diễn tả thành lời."
        ],
        ending: "Mãi yêu em ❤️",
        nextButtonText: "Xem lại những kỷ niệm của chúng mình 📸"
    },

    // 5. Màn 4: Album ảnh kỷ niệm Polaroid (Lật 3D xem mặt sau)
    polaroids: [
        {
            id: 1,
            image: "assets/images/memories/mem1.jpeg",
            date: "Khoảnh khắc đầu tiên ✨",
            title: "Ngày Đầu Ta Gặp Nhau 💖",
            caption: "Khoảnh khắc định mệnh đưa hai ta bước vào thế giới của nhau.",
            secretNote: "Ngày hôm ấy anh vẫn nhớ như in, nụ cười bẽn lẽn của em đã khiến tim anh lỗi nhịp ngay từ ánh nhìn đầu tiên. Cảm ơn định mệnh đã mang em đến bên anh! ❤️"
        },
        {
            id: 2,
            image: "assets/images/memories/mem2.jpeg",
            video: "assets/videos/fireworks.mp4", // File video quay pháo hoa giao thừa
            date: "Giao Thừa 2026 🎆",
            title: "Pháo Hoa & Có Em Bên Cạnh 🎆",
            caption: "Dưới bầu trời rực rỡ, điều ước duy nhất của anh là mãi bên em.",
            secretNote: "Khoảnh khắc pháo hoa bùng sáng đón năm mới 2026, anh chẳng nhìn lên trời mà chỉ mải ngắm nụ cười lung linh của em. Năm mới hay bao nhiêu năm nữa, chỉ cần có em bên cạnh là anh thấy trọn vẹn nhất rồi! 🥰"
        },
        {
            id: 3,
            image: "assets/images/memories/mem3.jpeg",
            date: "Thường ngày bên nhau 📱",
            title: "Những Cuộc Gọi Video Call 💬",
            caption: "Khoảng cách địa lý chẳng là gì khi trên màn hình luôn có nụ cười của em.",
            secretNote: "Dù ngày hôm ấy có mệt mỏi hay bận rộn đến đâu, chỉ cần bật camera lên và thấy khuôn mặt ngốc nghếch, đáng yêu của em là mọi muộn phiền tan biến hết. Yêu từng biểu cảm nhỏ nhất của em! 💕"
        },
        {
            id: 4,
            image: "assets/images/memories/mem4.jpeg",
            date: "Những chuyến đi bên nhau 🛵",
            title: "Những Lần Mình Đi Chơi Cùng Nhau 🌿",
            caption: "Cùng em rong ruổi khắp phố phường, mỗi góc đường đều ngập tràn tiếng cười.",
            secretNote: "Chỉ cần là đi cùng em, được chở em phía sau hay cùng nhau la cà khắp mọi nẻo đường thì nơi đâu cũng hóa thiên đường hạnh phúc. Mong chúng mình sẽ còn cùng nhau đi thật nhiều nơi nữa nhé! Yêu em ❤️"
        }
    ],

    // 6. Màn kết & Lời nhắn cuối
    ending: {
        title: "Em là món quà tuyệt vời nhất cuộc đời anh ✨",
        subtitle: "Cảm ơn em vì đã là một phần ấm áp nhất trong thế giới của anh.",
        replayButton: "Xem lại từ đầu 🔄",
        shareMessage: "Gửi ngàn nụ hôn và tình yêu đến em! 💖"
    },

    // 7. Cấu hình âm nhạc
    music: {
        title: "Giai điệu sinh nhật lãng mạn",
        autoPlayOnGiftOpen: true
    }
};

if (typeof window !== "undefined") {
    window.BIRTHDAY_CONFIG = BIRTHDAY_CONFIG;
}
