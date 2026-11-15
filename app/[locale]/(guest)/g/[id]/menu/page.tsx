import React, { Suspense } from 'react'
import { TableMenuClient } from './TableMenuClient'

export function generateStaticParams() {
  return [{ id: '1' }, { id: '5' }]
}

/**
 * Отдельная страница онлайн-меню еды и бара по QR-коду столика (/g/[id]/menu).
 */
export default async function TableMenuPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <Suspense fallback={null}>
      <TableMenuClient tableId={id || '5'} />
    </Suspense>
  )
}
