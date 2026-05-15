import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  try {
    // Cari barang yang statusnya 'Tersedia' dan belum dinotifikasi
    const { data, error } = await supabase
      .from('items')
      .select('id, title, location_found, category, image_url')
      .eq('status', 'Tersedia')
      .eq('is_notified', false);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Data berhasil diambil",
      data: data || []
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    // Update status is_notified menjadi true setelah Juan berhasil broadcast
    const body = await request.json();
    const { id } = body;

    const { error } = await supabase
      .from('items')
      .update({ is_notified: true })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `Barang dengan ID ${id} berhasil ditandai sebagai notified`
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}