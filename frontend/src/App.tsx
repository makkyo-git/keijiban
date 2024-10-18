import './App.css';
import React, { useEffect, useState }from 'react';

interface Post {
  post_id: number;
  author_name: string;
  title: string;
  content: string;
  created_at: string;
}


const App: React.FC = () => {

  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [message, setMessage] = useState<string>('');
  const [newPost, setNewPost] = useState<{ author_name: string; title: string; content: string}>({ author_name: '', title: '', content: ''});
  // 総ページ数の状態を追加
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
  

  console.log('Current Page:', page);
  console.log('Total Pages:', totalPages);
  console.log('Show Previous:', page > 1);
  console.log('Show Next:', page < totalPages);

    
    const fetchData = async () => {
      console.log('データを送信しました。');
      try {
        const response = await fetch(`http://localhost:8080/index.php?page=${page}`);
        if (!response.ok) throw new Error('ネットワークエラー');
        const data = await response.json();
        
        setPosts(data.posts || []);
        setMessage(data.message);
        setTotalPages(data.total_pages); // 総ページ数を設定
        console.log('Total Page :', data.total_pages);
      } catch (error) {
        console.error(error);
        setMessage('データの取得に失敗しました。');
      }
    };
    fetchData();
  }, [page]);
  
  // 投稿の送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/post.php', {
        method: 'POST',
        headers: {'Content-Type':  'application/x-www-form-urlencoded' },
        body: new URLSearchParams(newPost).toString(),
      });

      if (!response.ok) throw new Error('送信エラー');
      const data =await response.json();
      if (data.message) {
          setPosts(prevPosts => [
              ...prevPosts,
              {
                  post_id: Date.now(),
                  author_name:  newPost.author_name,
                  title: newPost.title,
                  content: newPost.content,
                  created_at: new Date(). toISOString(), // 現在の日時を設定
              },
          ]);
          setNewPost({ author_name: '', title: '', content: ''}); // 入力フォームをリセット
      }
      
      setMessage(data.message);
      setPage(1);
    } catch (error) {
      console.error('送信するのにエラーが発生しました。', error);
      setMessage('投稿に失敗しました。');
    }
  };

  // 投稿の削除
  const handleDelete = async (postId: number) => {
    try {
      const response = await fetch('http://localhost:8080/delete.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ post_id: postId.toString() }).toString(),
      });

      const data = await response.json();
      setMessage(data.message); // メッセージを設定

      // 投稿一覧を更新
      setPosts(prevPosts => prevPosts.filter(post => post.post_id !== postId));
    } catch (error) {
      console.error('削除中にエラーが発生しました。', error);
      setMessage('削除に失敗しました。');
    }
  };
  
  return (
    <div>
        <h1>掲示板</h1>
        <form onSubmit={handleSubmit}>
         <div className="form-container">
            <input type="text" id="author_name" value={newPost.author_name} onChange={e => setNewPost({ ...newPost, author_name: e.target.value })} placeholder="投稿者" required />
            <input type='text' id="title" value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value})} placeholder="タイトル" required />
            <textarea id="content" value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value})} placeholder="ここにメッセージを入力してください。" required />
            </div>
            <button type="submit" className="submit-button">投稿する</button>
        </form>
        

        {message && <div className="error">{message}</div> }

        <h2>投稿一覧</h2>
        {posts.map(post => (
            <div className="post" key={post.post_id} >
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <p>投稿者: {post.author_name} | 投稿日時: {post.created_at}</p>                
                    <input type="hidden" name="post_id" value={post.post_id} />
                    <button onClick={() => handleDelete(post.post_id)}  type="submit" className='delete-button'>削除</button>
            </div>
        ))}

        <div className="button-container">         
        {page > 1 && (
            <button onClick={() => setPage(prev => Math.max(prev - 1, 1))
              
            } className="prev-button">前へ</button> 
            )}

          {/*ページ番号の表示*/}
          {Array.from({ length: totalPages}, (_, index) => (
            <button
            key={index + 1}
            onClick={() => setPage(index + 1)}
            className={`page-button ${page === index + 1 ? 'active-page' : ''}`}
            >
              {index + 1}
            </button>
          ))}
          
        {page < totalPages && (
            <button onClick={() => setPage(prev => prev + 1)
            } className="next-button">次へ</button>
        )}          
        </div>
      </div>
  );
};

export default App;


  

