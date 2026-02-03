// =============================================================
//   JavaScript File - Açıklamalı Versiyon
//   Bu dosyada sayfa geçişleri, beğeni işlemleri, takip sistemi,
//   MyVerse filtreleme, SYD post sistemi, login/register ve
//   arama/ayar paneli scriptleri bulunmaktadır.
// =============================================================


// -------------------------------------------------------------
//  NAVBAR - Sayfa Geçişleri
// -------------------------------------------------------------
document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault(); // Link tıklamasında sayfanın yenilenmesini engeller

    // Tüm navbar linklerinden 'active' sınıfını kaldır
    document.querySelectorAll('.navbar a').forEach(el => el.classList.remove('active'));

    // Tıklanan linki aktif yap
    link.classList.add('active');

    const pageId = link.getAttribute('data-page');

    // Tüm sayfaları gizle
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));

    // İlgili sayfayı göster
    const pageToShow = document.getElementById(pageId);
    if (pageToShow) pageToShow.classList.add('active');

    // SYD sayfasına geçince formu sıfırla
    if (pageId === 'syd') {
      document.getElementById('syd-post-form').classList.add('hidden');
      document.getElementById('syd-post-prompt').classList.remove('hidden');
      document.getElementById('syd-post-content').value = '';
    }
  });
});


// -------------------------------------------------------------
//  DreamVerse - Beğeni & Yorum Aç/Kapa
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  const posts = document.querySelectorAll('.post');

  posts.forEach(post => {
    const likeBtn = post.querySelector('.post-actions .icon-btn:nth-child(1)');
    const commentBtn = post.querySelector('.post-actions .icon-btn:nth-child(2)');
    const likeCountSpan = likeBtn.querySelector('.count');
    const commentCountSpan = commentBtn.querySelector('.count');
    const allComments = post.querySelector('.all-comments');

    let liked = false; // Beğeni durumu

    // BEĞENME BUTONU
    likeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      liked = !liked;
      likeBtn.classList.toggle('active', liked);

      let count = parseInt(likeCountSpan.textContent);
      likeCountSpan.textContent = liked ? count + 1 : count - 1;

      // Beğeni yapılınca açık yorumlar kapanır
      allComments.classList.add('hidden');
      commentBtn.classList.remove('active');
    });

    // YORUM BUTONU
    commentBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      allComments.classList.toggle('hidden');
      commentBtn.classList.toggle('active');
    });

    // Yorum sayısına tıklanınca da aç/kapa
    commentCountSpan.addEventListener('click', (e) => {
      e.stopPropagation();
      allComments.classList.toggle('hidden');
      commentBtn.classList.toggle('active');
    });

    // Sayfanın boş yerine tıklanınca yorumları kapat
    document.addEventListener('click', () => {
      allComments.classList.add('hidden');
      commentBtn.classList.remove('active');
    });

    // Yorum alanı tıklanınca kapanmayı önle
    allComments.addEventListener('click', e => e.stopPropagation());
  });
});


// -------------------------------------------------------------
//  TAKİP / TAKİPTEN ÇIKMA ANİMASYONU
// -------------------------------------------------------------
function toggleFollow(button) {
  const icon = button.querySelector("i");

  // Çıkış animasyonu
  icon.classList.add("fade-out");

  setTimeout(() => {
    if (icon.classList.contains("fa-user-plus")) {
      icon.classList.remove("fa-user-plus");
      icon.classList.add("fa-user-check");
    } else {
      icon.classList.remove("fa-user-check");
      icon.classList.add("fa-user-plus");
    }

    // Giriş animasyonu
    icon.classList.remove("fade-out");
    icon.classList.add("fade-in");

    setTimeout(() => {
      icon.classList.remove("fade-in");
    }, 300);
  }, 150);
}


// -------------------------------------------------------------
//  MYVERSE - Filtreleme Sistemi 1
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const followingBtn = document.getElementById("following-btn");
  const allBtn = document.getElementById("all-btn");
  const posts = document.querySelectorAll("#myverse .post-card");
  const followers = document.querySelectorAll("#myverse .follower");

  // Başlangıç: tüm postlar
  showAllPosts();

  // Tümü butonu
  allBtn.addEventListener("click", () => {
    allBtn.classList.add("active");
    followingBtn.classList.remove("active");
    showAllPosts();
  });

  // Takip ettiklerin butonu (örnek mantık: çift index)
  followingBtn.addEventListener("click", () => {
    followingBtn.classList.add("active");
    allBtn.classList.remove("active");

    posts.forEach((post, index) => {
      post.style.display = index % 2 === 0 ? "block" : "none";
    });
  });

  // Sidebar’da kullanıcıya tıklayınca sadece o üyenin postları
  followers.forEach(follower => {
    follower.addEventListener("click", () => {
      const user = follower.getAttribute("data-user");
      posts.forEach(post => {
        const username = post.querySelector(".username").innerText;
        post.style.display = username === user ? "block" : "none";
      });
    });
  });

  function showAllPosts() {
    posts.forEach(post => post.style.display = "block");
  }
});


// -------------------------------------------------------------
//  MYVERSE - Filtreleme Sistemi 2 (data-user bazlı)
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const scope = document.querySelector("#myverse");
  if (!scope) return;

  const allBtn = scope.querySelector("#mv-all");
  const posts = scope.querySelectorAll(".post");
  const followerItems = scope.querySelectorAll(".mv-follower");

  // Sağ panel kullanıcıya tıklayınca filtre
  followerItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const user = item.getAttribute("data-user");
      filterByUser(user);
    });
  });

  // Post içindeki kullanıcı adına tıklayınca filtre
  scope.querySelectorAll(".post .username").forEach(nameEl => {
    nameEl.addEventListener("click", (e) => {
      e.preventDefault();
      const user = nameEl.textContent.trim();
      filterByUser(user);
    });
  });

  // Tümü butonu
  allBtn.addEventListener("click", () => {
    posts.forEach(p => p.style.display = "");
  });

  // Kullanıcı bazlı filtre
  function filterByUser(userHandle) {
    posts.forEach(p => {
      const match = p.getAttribute("data-user") === userHandle;
      p.style.display = match ? "" : "none";
    });
  }
});


// -------------------------------------------------------------
//  MyVerse Takipten Çıkma Toggle
// -------------------------------------------------------------
function toggleUnfollow(button) {
  const icon = button.querySelector("i");

  icon.classList.add("fade-out");

  setTimeout(() => {
    if (icon.classList.contains("fa-user-check")) {
      icon.classList.remove("fa-user-check");
      icon.classList.add("fa-user-plus");
    } else {
      icon.classList.remove("fa-user-plus");
      icon.classList.add("fa-user-check");
    }

    icon.classList.remove("fade-out");
    icon.classList.add("fade-in");

    setTimeout(() => icon.classList.remove("fade-in"), 300);
  }, 150);
}


// -------------------------------------------------------------
//  SYD POST SİSTEMİ (Form Aç/Kapa & Post Ekle)
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const postPrompt = document.getElementById('syd-post-prompt');
  const openPostFormBtn = document.getElementById('syd-open-post-form');
  const postForm = document.getElementById('syd-post-form');
  const cancelBtn = document.getElementById('syd-cancel-button');
  const postsList = document.getElementById('syd-posts-list');
  const postContent = document.getElementById('syd-post-content');

  // Form açma
  openPostFormBtn.addEventListener('click', () => {
    postPrompt.classList.add('hidden');
    postForm.classList.remove('hidden');
    postContent.focus();
  });

  // Form kapama
  cancelBtn.addEventListener('click', () => {
    postForm.reset();
    postForm.classList.add('hidden');
    postPrompt.classList.remove('hidden');
  });

  // Form gönderme
  postForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const content = postContent.value.trim();
    if (!content) return alert('Lütfen bir şey yaz.');

    const visibility = postForm.elements['syd-visibility'].value;
    addPost(content, visibility);

    alert(`Gönderin başarıyla ${visibility === 'public' ? 'herkese açık' : 'özel'} olarak paylaşıldı!`);

    postForm.reset();
    postForm.classList.add('hidden');
    postPrompt.classList.remove('hidden');
  });

  // Yeni post ekleme fonksiyonu
  function addPost(content, visibility) {
    const postDiv = document.createElement('div');
    postDiv.className = 'syd-post-item';
    postDiv.dataset.visibility = visibility;

    const contentP = document.createElement('p');
    contentP.textContent = content;
    postDiv.appendChild(contentP);

    const editBtn = document.createElement('button');
    editBtn.className = 'syd-edit-button';
    editBtn.textContent = 'Düzenle';
    postDiv.appendChild(editBtn);

    // Düzenleme işlemi
    editBtn.addEventListener('click', () => {
      const newContent = prompt('Postunu düzenle:', contentP.textContent);
      if (newContent && newContent.trim() !== '') {
        contentP.textContent = newContent.trim();
      }
    });

    postsList.prepend(postDiv);
  }
});


// -------------------------------------------------------------
//  SYD Public / Private Toggle
// -------------------------------------------------------------
const toggle = document.getElementById("visibilityToggle");
const statusText = document.getElementById("privacyStatus");

toggle.addEventListener("change", function () {
  statusText.textContent = this.checked
    ? "Current: Only SYD"
    : "Current: DreamVerse and SYD";
});


// -------------------------------------------------------------
//  LOGIN - Basit Demo Doğrulama
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('#login form.login-form');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = loginForm.username.value.trim();
    const password = loginForm.password.value.trim();

    if (!username || !password) return alert('Bilgileri eksiksiz girin.');

    alert(`Hoş geldin ${username}! (Demo giriş)`);

    loginForm.reset();
  });
});


// -------------------------------------------------------------
//  LOGIN / REGISTER Arası Geçiş
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const showRegisterBtn = document.getElementById('show-register-btn');
  const cancelRegisterBtn = document.getElementById('cancel-register-btn');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const googleLoginBtn = document.getElementById('google-login-btn');

  // Kayıt formunu aç
  showRegisterBtn.addEventListener('click', () => {
    loginForm.classList.add('hidden');
    showRegisterBtn.classList.add('hidden');
    googleLoginBtn.classList.add('hidden');
    registerForm.classList.remove('hidden');
  });

  // Kayıt formunu kapat
  cancelRegisterBtn.addEventListener('click', () => {
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    showRegisterBtn.classList.remove('hidden');
    googleLoginBtn.classList.remove('hidden');
  });

  // Login demo
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    alert('Giriş yapıldı (demo)');
  });

  // Register demo
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const pw1 = document.getElementById('reg-password').value;
    const pw2 = document.getElementById('reg-password2').value;

    if (pw1 !== pw2) return alert('Parolalar eşleşmiyor!');

    alert('Kayıt başarılı (demo)');

    cancelRegisterBtn.click();
  });

  // Google login demo
  googleLoginBtn.addEventListener('click', () => {
    alert('Google login sadece demo. Gerçek kullanım backend ister.');
  });
});


// -------------------------------------------------------------
//  SEARCH (Arama Inputu Animasyonu)
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const searchToggle = document.getElementById("search-toggle");
  const searchInput = document.getElementById("search-input");

  searchToggle.addEventListener("click", (e) => {
    e.preventDefault();

    searchInput.classList.toggle("active");

    if (searchInput.classList.contains("active")) searchInput.focus();
    else searchInput.blur();
  });
});


// -------------------------------------------------------------
//  AYARLAR PANELİ
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const settingsToggle = document.getElementById("settings-toggle");
  const settingsPanel = document.getElementById("settings-panel");
  const settingsOverlay = document.getElementById("settings-overlay");
  const closeSettings = document.getElementById("close-settings");

  function openSettings() {
    settingsPanel.classList.add("active");
    settingsOverlay.classList.add("active");
  }

  function closeSettingsPanel() {
    settingsPanel.classList.remove("active");
    settingsOverlay.classList.remove("active");
  }

  settingsToggle.addEventListener("click", openSettings);
  closeSettings.addEventListener("click", closeSettingsPanel);
  settingsOverlay.addEventListener("click", closeSettingsPanel);
});