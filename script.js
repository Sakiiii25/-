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
    pop: "『{topic}』めっちゃ良すぎた〜！！😆✨ テンション上がる〜！ 共有したくてつぶやいちゃう！ #おすすめ #日常",
    cool: "【記録】{topic}。\n無駄がなくて最高。こういう時間を大切にしていきたい。\n#ライフスタイル #記録",
    cute: "きいてきいて〜💕\n{topic}\nほんとに幸せな気分になっちゃった…えへへ🎀\n#かわちい #幸せ"
  },
  instagram: {
    pop: "🌟🌟🌟🌟🌟\n今日は『{topic}』！\n\nもう本当に最高すぎたからみんなにもシェアするね！😆\n絶対行った方がいい（やった方がいい）やつです✨\n\nまた明日から頑張ろーっと！\n\n---\n#最高の一日 #ハッピー #おすすめスポット",
    cool: "Moments.\n\n{topic}。\n\n静かな時間。\n研ぎ澄まされる感覚。\n\n---\n#lifestyle #chill #日常の切れ端",
    cute: "きょうのダイアリー 🧸🤍\n\n{topic}\n\nかわいくて、幸せで、胸がいっぱいになっちゃった🎀\nまたこんども行きたいな（やりたいな）〜！💕\n\n---\n#カフェ巡り #かわいいもの好きな人と繋がりたい #今日のコーデ"
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

    // SNSとテーマに合わせたランダムな綺麗な画像を持ってくる（Picsumというサービスを使います）
    // seedをつけることで、毎回違う画像が出ます
    const randomSeed = Math.floor(Math.random() * 1000);
    generatedImg.src = `https://picsum.photos/seed/${randomSeed}/800/600`;

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
  btnText.textContent = "魔法の言葉を作っています..."; // 文字を変える
  loader.classList.remove('hidden'); // くるくるを表示する
  resultSection.classList.add('hidden'); // 結果をいったん隠す
}

// 読み込み中（くるくる）を終わる仕組み
function stopLoading() {
  generateBtn.disabled = false; // ボタンをもう一度押せるようにする
  btnText.textContent = "魔法をかける！ ✨"; // 文字を戻す
  loader.classList.add('hidden'); // くるくるを隠す
}
