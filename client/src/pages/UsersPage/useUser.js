const fetchUsers = async ({
    page = 1,
    limit = 10,
}: {
    page
    limit: number
}) => {
    const { data } = await axios.post('/your-api-endpoint', {
        page,
        limit,
        status: 'active',
        game_id: 1,
    })
    return data
}

export const useUsers = (page: number, limit: number = 10) => {
    return useQuery < ApiResponse > ({
        queryKey: ['users', page],
        queryFn: () => fetchUsers({ page, limit }),
        keepPreviousData: true,
    })
}