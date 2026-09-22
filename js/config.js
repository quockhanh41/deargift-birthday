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
        topImage: "assets/images/portrait.jpeg", // Ảnh chân dung thật của người yêu trên đỉnh bánh
        instruction: "Hãy nhắm mắt lại 3 giây, ước một điều ước thật đẹp rồi nhấn 'Thổi Nến' nha! ✨",
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
            image: "assets/images/photo-1.jpeg",
            date: "Khoảnh khắc đáng nhớ",
            title: "Nụ cười tỏa nắng ✨",
            caption: "Nụ cười của em luôn làm cả ngày của anh bừng sáng.",
            secretNote: "Mỗi khi nhìn thấy nụ cười này, mọi mệt mỏi trong anh đều tan biến hết! Yêu em nhiều ❤️"
        },
        {
            id: 2,
            image: "assets/images/photo-2.jpeg",
            date: "Những ngày bên nhau",
            title: "Bình yên bên em 🌸",
            caption: "Chỉ cần ở cạnh em, mọi khoảnh khắc đều trở nên dịu dàng.",
            secretNote: "Ở bên em, anh luôn cảm nhận được sự ấm áp và bình yên nhất trần đời."
        },
        {
            id: 3,
            image: "assets/images/photo-3.jpeg",
            date: "Kỷ niệm ngọt ngào",
            title: "Ánh mắt biết cười 💕",
            caption: "Ánh mắt ấy chính là nơi anh muốn ngắm nhìn mãi mãi.",
            secretNote: "Ánh mắt em nhìn anh luôn khiến tim anh xao xuyến như những ngày đầu tiên."
        },
        {
            id: 4,
            image: "assets/images/photo-4.jpeg",
            date: "Hẹn hò lãng mạn",
            title: "Cùng em đi muôn nơi 🌅",
            caption: "Nắm tay em đi qua từng góc phố thân quen.",
            secretNote: "Chỉ cần là đi cùng em, bất cứ nơi đâu cũng hóa thành thiên đường hạnh phúc."
        },
        {
            id: 5,
            image: "assets/images/photo-5.jpeg",
            date: "Khoảnh khắc yêu thương",
            title: "Em là tất cả 💖",
            caption: "Hạnh phúc đơn giản là mỗi ngày đều có em kề bên.",
            secretNote: "Cảm ơn em vì đã đến và trở thành điều tuyệt vời nhất trong cuộc đời anh!"
        },
        {
            id: 6,
            image: "assets/images/photo-6.jpeg",
            date: "Hạnh phúc giản đơn",
            title: "Công chúa nhỏ của anh 👑",
            caption: "Mãi là cô bé đáng yêu và được anh chiều chuộng nhất nhé!",
            secretNote: "Dù em có lớn bao nhiêu, trong mắt anh em vẫn luôn là công chúa nhỏ cần được che chở."
        },
        {
            id: 7,
            image: "assets/images/photo-7.jpeg",
            date: "Từng ngày qua",
            title: "Ngọt ngào như kẹo 🍰",
            caption: "Tình yêu của chúng mình ngày càng thêm đượm nồng.",
            secretNote: "Mỗi ngày trôi qua anh lại thấy yêu em nhiều hơn ngày hôm qua một chút!"
        },
        {
            id: 8,
            image: "assets/images/photo-8.jpeg",
            date: "Ngày đặc biệt hôm nay",
            title: "Happy Birthday Em Yêu! 🎂",
            caption: "Chúc cho mọi ước mơ của em đều sẽ trở thành hiện thực.",
            secretNote: "Anh sẽ luôn ở đây, đồng hành và cùng em biến mọi ước mơ thành sự thật! Mãi bên em ❤️"
        },
        {
            id: 9,
            image: "assets/images/photo-9.jpeg",
            date: "Tình yêu ngọt ngào",
            title: "Nụ cười của em 💖",
            caption: "Nụ cười làm tan chảy trái tim anh mỗi ngày.",
            secretNote: "Chỉ cần nhìn thấy nụ cười của em là anh có thêm triệu động lực để cố gắng mỗi ngày!"
        },
        {
            id: 10,
            image: "assets/images/photo-10.jpeg",
            date: "Kỷ niệm khó quên",
            title: "Mãi bên nhau nhé 💍",
            caption: "Bên nhau trọn đời, cùng nhau già đi.",
            secretNote: "Cảm ơn em vì đã là người yêu tuyệt vời nhất của anh. Chúc mừng sinh nhật Yến Ngân! ❤️"
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
