import { events } from "./data.js";

const list = document.querySelector("#etkinlik-listesi");
const aramaKutusu = document.querySelector("#arama");
const kategoriSecimi = document.querySelector("#kategori-filtre");
const sonucSatiri = document.querySelector("#sonuc");

// Kart şablonunu oluşturur
function createCard(event) {
    const tarihDate = new Date(event.date);
    const formatliTarih = tarihDate.toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' });
    
    return `
    <article class="kart">
        <h2>${event.title}</h2>
        <p><strong>Kategori:</strong> ${event.category}</p>
        <p><strong>Tarih:</strong> ${formatliTarih}, ${event.time}</p>
        <p><strong>Yer:</strong> ${event.location}</p>
        <p><strong>Kontenjan:</strong> ${event.capacity} kişi</p>
        <p>${event.description}</p>
        <a href="etkinlik-detay.html?id=${event.id}">Detayları gör</a>
    </article>`;
}

// Ekrana basar
function render(dizi) {
    if (!list) return;
    
    list.innerHTML = dizi.map(createCard).join("");
    
    if (sonucSatiri) {
        if (dizi.length === 0) {
            sonucSatiri.textContent = "Aramanıza uygun etkinlik bulunamadı.";
        } else {
            sonucSatiri.textContent = `${dizi.length} etkinlik listeleniyor.`;
        }
    }
}

// Ana Sayfa için data-limit kontrolü (Yaklaşan 2 etkinlik)
if (list && list.dataset.limit) {
    const yaklasan = [...events]
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, Number(list.dataset.limit));
    render(yaklasan);
} 
// Etkinlikler sayfası için tümü ve filtreleme
else if (list) {
    // Kategorileri veriden bir kez (benzersiz) çekip select'e ekler
    if (kategoriSecimi) {
        const kategoriler = [...new Set(events.map(e => e.category))];
        kategoriler.forEach(kat => {
            const option = document.createElement("option");
            option.value = kat;
            option.textContent = kat;
            kategoriSecimi.appendChild(option);
        });

        // Event listener'lar
        aramaKutusu.addEventListener("input", filtrele);
        kategoriSecimi.addEventListener("change", filtrele);
        
        // Enter'a basınca sayfa yenilenmesini engelle
        const form = document.querySelector("#filtre-formu");
        if(form) form.addEventListener("submit", e => e.preventDefault());
    }
    
    render(events);
}

// Arama ve Kategori filtreleme mantığı
function filtrele() {
    const aranan = aramaKutusu.value.toLocaleLowerCase("tr-TR");
    const secilenKategori = kategoriSecimi.value;

    const sonuc = events.filter((e) => {
        const metinUyuyor = e.title.toLocaleLowerCase("tr-TR").includes(aranan) || 
                            e.description.toLocaleLowerCase("tr-TR").includes(aranan) ||
                            e.category.toLocaleLowerCase("tr-TR").includes(aranan);
        const kategoriUyuyor = secilenKategori === "" || e.category === secilenKategori;
        return metinUyuyor && kategoriUyuyor;
    });
    render(sonuc);
}