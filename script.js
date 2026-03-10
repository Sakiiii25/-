// 画面の部品（HTMLの要素）を見つけて、名前をつける
// 例えるなら、「あとで使う道具を机の上に出しておく」ようなものです
const topicInput = document.getElementById('topic');
const platformSelect = document.getElementById('platform');
const toneSelect = document.getElementById('tone');
const generateBtn = document.getElementById('generate-btn');
const btnText = document.querySelector('.btn-text');
const loader = document.querySelector('.loader');
const resultSection = document.getElementById('result-section');
const generatedTextArea = document.getElementById('generated-text');
const generatedImg = document.getElementById('generated-img');
const copyBtn = document.getElementById('copy-btn');

// --- 魔法のテンプレート（文章のひな形） ---
// どういう雰囲気（tone）で、どういうSNS（platform）かによって文章を変えます
const templates = {
  twitter: {
    pop: "『{topic}』……それは、私が美しいと感じた刹那。🥀\nこの感動を、夜の闇にそっと囁きます。\n#おすすめ #静かな夜空",
    cool: "【記録】{topic}。\n一切の無駄がない、洗練された時間。\nこの暗闇の中で、心だけが静かに燃えている。\n#ライフスタイル #漆黒",
    cute: "聞いてね、夜の妖精さんたち🦋\n{topic}……\nふわふわで、ちょっとだけミステリアスな魔法にかかっちゃったみたい🌙\n#魔法使い #お気に入り"
  },
  instagram: {
    pop: "🥀🥀🥀\n今宵は『{topic}』……。\n\nあまりにも美しくて、言葉を失うほどでした。\nこの儚い時間を、みなさんにもシェアしますね🕸️\n\n絶対に体験するべき、甘美なひととき。\n\n---\n#素晴らしい夜 #ゴシック #おすすめスポット",
    cool: "Fragments in the dark.\n\n{topic}。\n\n音のない空間。\n研ぎ澄まされる、闇への沈溺。\n\n---\n#lifestyle #darkness #漆黒の日常",
    cute: "夜のダイアリー 🧸🥀\n\n{topic}\n\nちょっぴりダークで、でもかわいくて。\n胸の奥がキュンってなっちゃった🦋\nまた夜が来たら、会いにいきたいな……。\n\n---\n#秘密の場所 #ゴシックロリータ #今日のコーデ"
  }
};


// 魔法をかけるボタンを押したときの動き（イベント）
generateBtn.addEventListener('click', () => {
  // 入力された文字を読み取る
  const topic = topicInput.value.trim(); // 空白を消して文字だけ取り出す

  // もし何も入力されていなかったら、お願いのメッセージを出す
  if (topic === "") {
    alert("「どんなことを投稿したいですか？」を入力してね！");
    return; // ここで動きを止める
  }

  // 選ばれたSNSと雰囲気を読み取る
  const platform = platformSelect.value;
  const tone = toneSelect.value;

  // 1. ボタンを「作ってる最中モード（くるくる）」にする
  startLoading();

  // 2. 少し待ってから結果を出す（魔法の時間を演出！✨）
  // setTimeoutは、「指定した時間（今回は1.5秒）待ってから処理をする」タイマーです。
  setTimeout(() => {
    
    // テンプレートの {topic} の部分を、入力された文字に置き換える
    const resultText = templates[platform][tone].replace(/{topic}/g, topic);
    
    // 画面に文章を表示する
    generatedTextArea.textContent = resultText;

    // 画像を白黒（モノクロ）にして、ゴシックな雰囲気を引き立てます
    // ?grayscale というパス（おまじない）をつけると白黒になります
    const randomSeed = Math.floor(Math.random() * 1000);
    generatedImg.src = `https://picsum.photos/seed/${randomSeed}/800/600?grayscale`;

    // 隠していた「結果の画面」を表示する
    resultSection.classList.remove('hidden');

    // ボタンを元の状態に戻す
    stopLoading();

  }, 1500); // 1500ミリ秒 ＝ 1.5秒
});

// コピーするボタンを押したときの動き
copyBtn.addEventListener('click', () => {
  // 画面に表示されている文章を読み取る
  const textToCopy = generatedTextArea.textContent;

  // クリップボード（パソコンの記憶）にコピーする
  navigator.clipboard.writeText(textToCopy).then(() => {
    // 成功したら、ボタンの文字を一時的に変える
    const originalText = copyBtn.textContent;
    copyBtn.textContent = "コピーできました！ ✅";
    
    // 2秒後に元の文字に戻す
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  });
});

// --- 便利なお助けの仕組み（関数） ---

// 読み込み中（くるくる）を始める仕組み
function startLoading() {
  generateBtn.disabled = true; // ボタンを2回押せないようにする
  // ゴシックな言葉に変えます
  btnText.textContent = "魔力を編み込んでいます..."; 
  loader.classList.remove('hidden'); // くるくるを表示する
  resultSection.classList.add('hidden'); // 結果をいったん隠す
}

// 読み込み中（くるくる）を終わる仕組み
function stopLoading() {
  generateBtn.disabled = false; // ボタンをもう一度押せるようにする
  // 変更した文字に戻します
  btnText.textContent = "闇の魔法をかける 🦇"; 
  loader.classList.add('hidden'); // くるくるを隠す
}
