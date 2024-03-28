import React from 'react'

export const ComponentA: React.FC = () => {
    // 敢えてエラーを起こさせる
    const methodDoesNotExist =(): void => {
        throw new Error('Function not implemented.');
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
