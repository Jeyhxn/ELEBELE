using SocialMediaForGamersApp.Models;
using System.Linq.Expressions;

namespace SocialMediaForGamersApp.Repositories.Interfaces
{
    public interface IRepository
    {
        //category
        IQueryable<Category> CategoryGetAll(Expression<Func<Category, bool>>? expression = null,
            Expression<Func<Category, object>>? orderExpression = null,
            int skip = 0,
            int take = 0,
            bool isDescending = false,
            bool isTracking = false,
            params string[]? includes);
        Task<Category> CategoryGetByIdAsync(int id); 
        Task AddAsync(Category category);
        void Delete(Category category);
        void Update(Category category);
        Task SaveChangeAsync();

        //platform
        IQueryable<Platform> PlatformGetAll(Expression<Func<Platform, bool>>? expression = null,
            Expression<Func<Platform, object>>? orderExpression = null,
            int skip = 0,
            int take = 0,
            bool isDescending = false,
            bool isTracking = false,
            params string[]? includes);
        Task<Platform> PlatformGetByIdAsync(int id);
        Task AddAsync(Platform platform);
        void Delete(Platform platform);
        void Update(Platform platform);

        //game
        IQueryable<Game> GameGetAll(Expression<Func<Game, bool>>? expression = null,
    Expression<Func<Game, object>>? orderExpression = null,
    int skip = 0,
    int take = 0,
    bool isDescending = false,
    bool isTracking = false,
    params string[]? includes);
        Task<Game> GameGetByIdAsync(int id);
        Task AddAsync(Game game);
        void Delete(Game game);
        void Update(Game game);

        //game platform
        Task AddAsync(GamePlatform gamePlatform);
        void Delete(GamePlatform gamePlatform);
    }
}
