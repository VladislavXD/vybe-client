import React, { Suspense } from 'react'
import { TableReviewClient } from './TableReviewClient'

export function generateStaticParams() {
  return [{ id: '1' }, { id: '5' }]
}

/**
 * Отдельная страница отзывов и чаевых заведения по QR-коду стола или NFC-метке (/g/[id]/review).
 */
export default async function TableReviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <Suspense fallback={null}>
      <TableReviewClient tableId={id || '5'} />
    </Suspense>
  )
}
