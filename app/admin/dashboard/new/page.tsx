'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCar, updateCar } from '@/lib/actions/cars'
import { storageService } from '@/lib/services/storage'
import { CarInsert } from '@/lib/supabase/types'

export default function NewCarPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [formData, setFormData] = useState<CarInsert>({
        title: '',
        price: 0,
        year: new Date().getFullYear(),
        km: 0,
        transmission: 'manual',
        fuel: 'flex',
        description: '',
        images: [],
    })

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files))
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            // 1. Criar o registro do carro primeiro (para ter o ID)
            const car = await createCar({ ...formData, images: [] })

            // 2. Upload das imagens usando o ID do carro
            if (selectedFiles.length > 0) {
                const imageUrls = await storageService.uploadImages(
                    selectedFiles,
                    car.id
                )

                // 3. Atualizar o carro com as URLs das imagens
                await updateCar(car.id, { images: imageUrls })
            }

            router.push('/admin/dashboard')
        } catch (error) {
            console.error('Erro ao criar carro:', error)
            alert('Erro ao criar carro. Verifique o console para mais detalhes.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Adicionar Novo Carro</h1>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        ← Voltar
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Título *</label>
                        <input
                            type="text"
                            required
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                            placeholder="Ex: Chevrolet Onix 1.0 LT"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Preço (R$) *
                            </label>
                            <input
                                type="number"
                                required
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.price}
                                onChange={(e) =>
                                    setFormData({ ...formData, price: Number(e.target.value) })
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Ano *</label>
                            <input
                                type="number"
                                required
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.year}
                                onChange={(e) =>
                                    setFormData({ ...formData, year: Number(e.target.value) })
                                }
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Quilometragem *
                            </label>
                            <input
                                type="number"
                                required
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.km}
                                onChange={(e) =>
                                    setFormData({ ...formData, km: Number(e.target.value) })
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Câmbio *</label>
                            <select
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.transmission}
                                onChange={(e) =>
                                    setFormData({ ...formData, transmission: e.target.value })
                                }
                            >
                                <option value="manual">Manual</option>
                                <option value="automático">Automático</option>
                                <option value="CVT">CVT</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Combustível *
                        </label>
                        <select
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.fuel}
                            onChange={(e) =>
                                setFormData({ ...formData, fuel: e.target.value })
                            }
                        >
                            <option value="flex">Flex</option>
                            <option value="gasolina">Gasolina</option>
                            <option value="etanol">Etanol</option>
                            <option value="diesel">Diesel</option>
                            <option value="elétrico">Elétrico</option>
                            <option value="híbrido">Híbrido</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Descrição</label>
                        <textarea
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            rows={4}
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            placeholder="Descreva as características do veículo..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Imagens</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                        {selectedFiles.length > 0 && (
                            <p className="text-sm text-gray-600 mt-1">
                                {selectedFiles.length} arquivo(s) selecionado(s)
                            </p>
                        )}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            disabled={loading}
                        >
                            {loading ? 'Salvando...' : 'Salvar Carro'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
