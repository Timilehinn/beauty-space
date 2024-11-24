export function groupServicesByGroup(services) {
  const groupedServices = []

  services.forEach((service) => {
    if (service.groups) {
      // Handle the initial structure
      service.groups.forEach((group) => {
        const existingGroup = groupedServices.find(
          (item) => item.id === group.id
        )
        if (existingGroup) {
          existingGroup.services.push({
            groupId: group.id,
            id: service.id,
            name: service.name,
            price: service.price,
            min_hour: service.min_hour,
            home_service_price: service.home_service_price,
            type: service.type,
            created_at: service.created_at,
            updated_at: service.updated_at,
            images: service.photos,
          })
        } else {
          groupedServices.push({
            id: group.id,
            name: group.name,
            asset_urls: group.asset_urls,
            user_id: group.user_id,
            created_at: group.created_at,
            updated_at: group.updated_at,
            services: [
              {
                groupId: group.id,
                id: service.id,
                name: service.name,
                price: service.price,
                min_hour: service.min_hour,
                home_service_price: service.home_service_price,
                type: service.type,
                created_at: service.created_at,
                updated_at: service.updated_at,
                images: service.photos,
              },
            ],
          })
        }
      })
    } else if (service.services) {
      // Handle the restructured format
      const existingGroup = groupedServices.find(
        (item) => item.id === service.id
      )
      if (existingGroup) {
        existingGroup.services = existingGroup.services.concat(service.services)
      } else {
        groupedServices.push({
          id: service.id,
          name: service.name,
          asset_urls: service.asset_urls || [],
          user_id: service.user_id,
          created_at: service.created_at,
          updated_at: service.updated_at,
          services: service.services,
        })
      }
    }
  })

  return groupedServices
}
