import React from 'react'

export const ComponentA: React.FC = () => {
    // 敢えてエラーを起こさせる
    const methodDoesNotExist =(): void => {
        try {
            throw new Error();
        } catch (error) {
            throw new Error('エラーだよ');
        }
        
    }

  return (
    <>
        <div>ComponentA</div>
        <button
            onClick={() => methodDoesNotExist()}
        >
            ボタン
        </button>
    </>
  )
}
