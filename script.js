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

// --- 追加された写真加工用の要素 ---
const imageUpload = document.getElementById('image-upload');
const editorContainer = document.getElementById('editor-container');
const imageCanvas = document.getElementById('image-canvas');
const ctx = imageCanvas.getContext('2d'); // キャンバスに絵を描くためのペン
const filterBtns = document.querySelectorAll('.filter-btn');
const downloadBtn = document.getElementById('download-btn');
const copyBtn = document.getElementById('copy-btn');

// アップロードされた写真のデータを覚えておく場所
let currentImage = null;
let currentFilter = 'normal'; // 最初はノーマル

// --- 魔法のテンプレート（文章のひな形） ---
// どういう雰囲気（tone）で、どういうSNS（platform）かによって文章を変えます
const templates = {
  twitter: {
    corporate: "【お知らせ】\n本日は『{topic}』についてご紹介します。\n皆様の日常がより豊かになるヒントになれば幸いです。\n詳細につきましては、ぜひご体験ください。\n#企業公式 #おすすめ情報",
    oshikatsu: "ちょっと待って、無理😭🙏✨\n『{topic}』って最高すぎない！？\n尊すぎて語彙力なくした……共感してくれる人いますか……？🥺💖\n#推し活 #推しのいる生活 #尊い",
    ai: "こんにちは。私はAIアシスタントです🤖\n『{topic}』について分析した結果、非常に興味深いデータが得られました。\nこのトピックは今後のトレンドになる可能性が高いと予測します。\n#AI予測 #トレンド分析"
  },
  instagram: {
    corporate: "いつもご覧いただきありがとうございます。\n\n今回は『{topic}』についてのご案内です。\n私たちの新しい取り組みや、日々の発見を皆様にお届けします。\n\nぜひ、こちらの魅力をお楽しみくださいませ。\n\n---\n#お知らせ #ビジネスライフ #丁寧な暮らし",
    oshikatsu: "見て見て〜〜！！！😭💖💖\n\n『{topic}』\n\nもう本当にビジュ爆発してるし、最高すぎて無理……💸✨\nこの感動をみんなと分かち合いたいっっ！\n同じ思いの人、いいね＆コメント待ってます🥺🫶\n\n---\n#推し活 #オタ活 #推しが尊い #ありがとう世界",
    ai: "テキスト生成を完了しました。電子頭脳からのレポートです。\n\n対象データ：『{topic}』\n\n分析結果によると、この要素は非常に優れた特徴を持っています。\n詳細なデータに基づいて、皆様に最適な情報を提供いたします。\n\n---\n#AI生成 #サイバー #未来のテクノロジー #データ分析"
  },
  facebook: {
    corporate: "皆様、いつも温かいご支援をありがとうございます。\n\n本日は『{topic}』に関する取り組みをご報告いたします。\n私たちが目指すビジョンに一歩近づくための重要なマイルストーンとなります。\n\n引き続き、ご指導ご鞭撻のほどよろしくお願い申し上げます。\n\n#ご報告 #企業活動 #コミュニティ",
    oshikatsu: "今日は『{topic}』のイベントに行ってきました！😆✨\n本当に楽しかったし、たくさんの元気をもらえました！\n\n同じファンのお友達とも交流できて、最高の1日でした。\nこれからも全力で応援していきます！\n\n#推し活記録 #ファンと繋がりたい #最高の一日",
    ai: "コミュニティの皆様へご案内です。\n『{topic}』領域における最新の動向を共有いたします。\n\n本件は、多くのユーザーにとって有益な情報となるよう設計されています。\nご意見やご感想がございましたら、コメント欄にてお寄せください。\n\n#情報共有 #テクノロジー #AI活用"
  },
  tiktok: {
    corporate: "今回は『{topic}』のウラ側を大公開！✨\n知られざるプロの技をチェックしてね👀\n\n少しでも参考になったら、いいね＆フォローをお願いします！\n\n#企業公式 #裏側公開 #ノウハウ #おすすめにのりたい",
    oshikatsu: "『{topic}』\nこれ見た瞬間、天才だと思いました🥺💕\n\nみんなの推しポイントもコメントで教えて！👇\n\n#推し活 #尊い #バズれ #オタクの日常",
    ai: "システム起動。本日のテーマ『{topic}』🤖\n\nたった15秒で分かる、魔法のようなハックを紹介。\n最後まで見て、データを保存してください。\n\n#AIのいる生活 #ライフハック #未来 #テック"
  },
  youtube: {
    corporate: "ご視聴ありがとうございます。\n本日の動画では、多くのお問い合わせをいただいた『{topic}』について解説しています。\n\n▼目次\n0:00 オープニング\n1:30 本編スタート\n\n気に入っていただけましたら、チャンネル登録と高評価をお願いいたします！",
    oshikatsu: "みんなーーー！！今日も見てくれてありがとう😭✨\n今回のテーマは……なんと『{topic}』です！🎉\n\nもうね、語りたいことが多すぎて動画長くなっちゃった（笑）\nぜひ最後まで見てってね！コメントも全部読んでます💖\n\n#推し活 #Vlog #語り",
    ai: "本チャンネルへようこそ。ナビゲーターのAIです。\n今回は『{topic}』の解説と、その影響についてシミュレーションを行いました。\n\n関連リンクは概要欄下部に掲載しています。\n次回のアップデート情報を受け取るため、チャンネル登録をお推奨します。"
  },
  business: {
    corporate: "【プレスリリース】\n平素より大変お世話になっております。\n弊社はこの度、『{topic}』に向けた新たなプロジェクトを始動いたしました。\n\n業界の発展に貢献できるよう、一層の努力を重ねて参ります。\n詳細は添付のリンクより弊社Webサイトをご覧ください。",
    oshikatsu: "（※ビジネス用のため表示を調整しています）\n【推し事レポート】\n本日のミッション『{topic}』、無事コンプリートしました！🫡\n\n圧倒的なパフォーマンスに仕事のモチベーションも爆上がりです。\n明日からも頑張れます！🔥",
    ai: "【自動配信レポート】\nトピック『{topic}』に関連するデータ集計が完了しました。\n\n・エンゲージメント率：向上傾向\n・ユーザー関心度：非常に高い\n\n今後のビジネス戦略において、この傾向を注視することを推奨します。"
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

  // 2. 少し待ってから結果を出す（AIが考えているような演出）
  // setTimeoutは、「指定した時間（今回は2.5秒）待ってから処理をする」タイマーです。
  setTimeout(() => {
    
    // テンプレートの {topic} の部分を、入力された文字に置き換える
    const resultText = templates[platform][tone].replace(/{topic}/g, topic);
    
    // 画面に文章を表示する
    generatedTextArea.textContent = resultText;

    // 隠していた「結果の画面」を表示する
    // 画像はアップロードされた時だけ表示するので、ここでは文章のエリアだけを表示します
    resultSection.classList.remove('hidden');

    // ボタンを元の状態に戻す
    stopLoading();

  }, 2500); // 2500ミリ秒 ＝ 2.5秒（3秒以内）
});

// ----------------------------------------------------
// 写真加工の仕組み
// ----------------------------------------------------

// 1. 写真が選ばれた時（アップロードされた時）
imageUpload.addEventListener('change', (event) => {
  const file = event.target.files[0]; // 選ばれた一番最初のファイル
  if (!file) return; // 何も選ばれなかったらやめる

  // 画像を読み込むための仕組み（リーダー）
  const reader = new FileReader();

  // 読み込みが終わったら、画面に表示する準備をする
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      // 写真を覚えておく
      currentImage = img;
      
      // キャンバスを表示する
      editorContainer.classList.remove('hidden');
      resultSection.classList.remove('hidden'); // まだ開いていなければ開く
      
      // キャンバスに写真を描く（正方形にする）
      drawImageOnCanvas();
    };
    img.src = e.target.result; // パソコンの中の写真のデータを渡す
  };

  reader.readAsDataURL(file); // 読み込みスタート
});

// 2. キャンバスに写真を描く（自動でSNS用の正方形に切り抜く）
function drawImageOnCanvas() {
  if (!currentImage) return;

  // キャンバスの大きさを決める（今回は高画質にするため大きめの800px四方にします）
  const canvasSize = 800;
  imageCanvas.width = canvasSize;
  imageCanvas.height = canvasSize;

  // 写真の縦横を比べて、短い方に合わせて正方形の「切り取る枠」を決める
  const minSide = Math.min(currentImage.width, currentImage.height);
  // 真ん中から切り取るためのスタート位置を計算
  const startX = (currentImage.width - minSide) / 2;
  const startY = (currentImage.height - minSide) / 2;

  // 一旦キャンバスを綺麗にする
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  // （高度）CSSのフィルターではなく、キャンバスに直接エフェクトを焼き付ける準備
  // これをしないと、ダウンロードした時にフィルターが反映されません
  if (currentFilter === 'slr') {
    ctx.filter = 'contrast(1.1) saturate(1.2)';
  } else if (currentFilter === 'purikura') {
    ctx.filter = 'brightness(1.2) contrast(0.9) saturate(1.3) sepia(0.2) hue-rotate(-10deg)';
  } else {
    ctx.filter = 'none';
  }

  // キャンバスに写真をギュッと敷き詰める（切り抜きながら）
  ctx.drawImage(
    currentImage, 
    startX, startY, minSide, minSide, // 元の写真の切り取る場所
    0, 0, canvasSize, canvasSize // キャンバスのどこに描くか
  );

  // 一眼レフ風の場合、周りを少し暗くする（ビネット効果）を足す
  if (currentFilter === 'slr') {
    // 真ん中が白（透明）、外側が黒いグラデーションを作る
    const gradient = ctx.createRadialGradient(
      canvasSize/2, canvasSize/2, canvasSize * 0.3, // 真ん中の円
      canvasSize/2, canvasSize/2, canvasSize * 0.8  // 外側の円
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)'); // 真ん中は透明
    gradient.addColorStop(1, 'rgba(0,0,0,0.4)'); // 外側は少し黒い

    // 重ね塗りする
    ctx.filter = 'none'; // グラデーションにはフィルターをかけない
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasSize, canvasSize);
  }
  
  // フィルター設定をリセットしておく
  ctx.filter = 'none';
}

// 3. フィルターのボタンが押された時
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // 一旦すべてのボタンから「選択中（active）」のマークを外す
    filterBtns.forEach(b => b.classList.remove('active'));
    // 押されたボタンに「選択中」をつける
    btn.classList.add('active');

    // どのフィルターが選ばれたか覚える
    currentFilter = btn.dataset.filter;

    // 写真を描き直す
    drawImageOnCanvas();
  });
});

// 4. ダウンロード（保存）ボタンを押した時
downloadBtn.addEventListener('click', () => {
  if (!currentImage) return;

  // キャンバスの中身を画像データ（URLのような形）にする
  const dataUrl = imageCanvas.toDataURL('image/jpeg', 0.9); // 0.9は画質の綺麗さ（MAX1.0）

  // 見えない「ダウンロード用のリンク（<a>タグ）」を作る
  const link = document.createElement('a');
  link.download = 'sns_maker_image.jpg'; // 保存されるファイルの名前
  link.href = dataUrl;
  
  // その見えないリンクを自動でクリックさせる（これで保存が始まります）
  link.click();
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
  // 読み込み中の言葉に変えます
  btnText.textContent = "生成中です..."; 
  loader.classList.remove('hidden'); // くるくるを表示する
  resultSection.classList.add('hidden'); // 結果をいったん隠す
}

// 読み込み中（くるくる）を終わる仕組み
function stopLoading() {
  generateBtn.disabled = false; // ボタンをもう一度押せるようにする
  // 変更した文字に戻します
  btnText.textContent = "生成する"; 
  loader.classList.add('hidden'); // くるくるを隠す
}
