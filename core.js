const BOOKS={
 b1:["Βιβλίο 1 (βιβλίο μαθητή)","https://ebooks.edu.gr/ebooks/d/8547/2560/22-0275-01_V2_Anaptyxi-Efarmogon-se-Programmatistiko-Perivallon_G-Lykeiou-SpOikPlir_Vivlio-Mathiti.pdf"],
 b2:["Βιβλίο 2 (οδηγίες μελέτης)","https://ebooks.edu.gr/ebooks/d/8547/5294/22-0278-01_Anaptyxi-Efarmogon-se-Programmatistiko-Perivallon_G-Lykeiou-SpOikPlir_Odigies-Meletis-Mathiti.pdf"],
 b3:["Βιβλίο 3 (συμπληρωματικό υλικό)","https://ebooks.edu.gr/ebooks/d/8547/5295/22-0279-01_Pliroforiki_G-Lykeiou-SpOikPlir_Sympliromatiko-Ekpaideutiko-Yliko.pdf"],
 b4:["Βιβλίο 4 (λύσεις Βιβλίου 3)","https://ebooks.edu.gr/ebooks/d/8547/5296/22-0263-01_Pliroforiki-G-Lykeiou-SpOikPlir_Lyseis-Askiseon.pdf"],
 b5:["Βιβλίο 5 (τετράδιο μαθητή)","https://ebooks.edu.gr/ebooks/d/8547/2562/22-0204-02_Anaptyxi_Efarmogon-se-Programmatistiko-Perivallon_G-Lykeiou-SpOikPlir_Tetradio-Mathiti.pdf"]};
const link=(k,t)=>`<a href="${BOOKS[k][1]}" target="_blank" rel="noopener">${t||BOOKS[k][0]}</a>`;
const CH=[];
