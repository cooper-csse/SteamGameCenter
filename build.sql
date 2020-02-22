USE [master]
GO


IF(DB_ID('SteamGameCenterRebuild20') IS NOT NULL)
BEGIN
	DROP DATABASE SteamGameCenterRebuild20
	print('')
	print('-----------------------------')
	print('Successfully dropped database')
	print('-----------------------------')
	print('')
END

------------------------------------------------------------------------------------
--Find and replace all instances of SteamGameCenterRebuild20 with desired database--
------------------------------------------------------------------------------------

CREATE DATABASE SteamGameCenterRebuild20
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'SteamGameCenterRebuild20', FILENAME = N'E:\Database\MSSQL12.MSSQLSERVER\MSSQL\DATA\SteamGameCenterRebuild20.mdf' , SIZE = 20480KB , MAXSIZE = 1024000KB , FILEGROWTH = 10%)
 LOG ON 
( NAME = N'SteamGameCenterRebuild20Log', FILENAME = N'E:\Database\MSSQL12.MSSQLSERVER\MSSQL\DATA\SteamGameCenterRebuild20.ldf' , SIZE = 20480KB , MAXSIZE = 1024000KB , FILEGROWTH = 10%)
GO

IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [SteamGameCenterRebuild20].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE SteamGameCenterRebuild20 SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE SteamGameCenterRebuild20 SET ANSI_NULLS OFF 
GO
ALTER DATABASE SteamGameCenterRebuild20 SET ANSI_PADDING OFF 
GO
ALTER DATABASE SteamGameCenterRebuild20 SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE SteamGameCenterRebuild20 SET ARITHABORT OFF 
GO
ALTER DATABASE SteamGameCenterRebuild20 SET AUTO_CLOSE OFF 
GO
ALTER DATABASE SteamGameCenterRebuild20 SET AUTO_SHRINK OFF 
GO
ALTER DATABASE SteamGameCenterRebuild20 SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE SteamGameCenterRebuild20 SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE SteamGameCenterRebuild20 SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE SteamGameCenterRebuild20 SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE SteamGameCenterRebuild20 SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE SteamGameCenterRebuild20 SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE SteamGameCenterRebuild20 SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE SteamGameCenterRebuild20 SET  ENABLE_BROKER 
GO
ALTER DATABASE SteamGameCenterRebuild20 SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE SteamGameCenterRebuild20 SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
--ALTER DATABASE SteamGameCenterRebuild20 SET TRUSTWORTHY OFF 
--GO
ALTER DATABASE SteamGameCenterRebuild20 SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE SteamGameCenterRebuild20 SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE SteamGameCenterRebuild20 SET READ_COMMITTED_SNAPSHOT OFF 
GO
--ALTER DATABASE SteamGameCenterRebuild20 SET HONOR_BROKER_PRIORITY OFF 
--GO
ALTER DATABASE SteamGameCenterRebuild20 SET RECOVERY FULL 
GO
ALTER DATABASE SteamGameCenterRebuild20 SET  MULTI_USER 
GO
ALTER DATABASE SteamGameCenterRebuild20 SET PAGE_VERIFY CHECKSUM  
GO
--ALTER DATABASE SteamGameCenterRebuild20 SET DB_CHAINING OFF 
--GO
ALTER DATABASE SteamGameCenterRebuild20 SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE SteamGameCenterRebuild20 SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
ALTER DATABASE SteamGameCenterRebuild20 SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE SteamGameCenterRebuild20 SET  READ_WRITE 
GO



---------------------------------------------------------------------------------------------
------------------------------------TABLE CREATION-------------------------------------------
---------------------------------------------------------------------------------------------
USE SteamGameCenterRebuild20
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tag](
	[ID] [uniqueidentifier] NOT NULL,
	[Name] [varchar](20) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[License](
	[ID] [uniqueidentifier] NOT NULL,
	[StartDate] [date] NOT NULL,
	[EndDate] [date] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[License]  WITH CHECK ADD CHECK  (([StartDate]<[EndDate]))
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Login](
	[Username] [varchar](20) NOT NULL,
	[Password] [char](64) NULL,
	[Salt] [char](32) NULL,
	[Admin] [smallint] NOT NULL,
 CONSTRAINT [Login_pk] PRIMARY KEY NONCLUSTERED 
(
	[Username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO



SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Publisher](
	[ID] [uniqueidentifier] NOT NULL,
	[Name] [varchar](40) NOT NULL,
	[LicenseID] [uniqueidentifier] NULL,
 CONSTRAINT [PK__Publishe__3214EC27D6E5BE70] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Publisher]  WITH CHECK ADD  CONSTRAINT [FK__Publisher__Lisce__7E37BEF6] FOREIGN KEY([LicenseID])
REFERENCES [dbo].[License] ([ID])
GO
ALTER TABLE [dbo].[Publisher] CHECK CONSTRAINT [FK__Publisher__Lisce__7E37BEF6]
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Developer](
	[ID] [uniqueidentifier] NOT NULL,
	[Name] [varchar](40) NOT NULL,
	[Address] [varchar](80) NULL,
 CONSTRAINT [PK__Develope__3214EC272B217EC3] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Game](
	[ID] [uniqueidentifier] NOT NULL,
	[Title] [varchar](35) NOT NULL,
	[Price] [money] NOT NULL,
	[Sale] [real] NOT NULL,
	[Release] [date] NOT NULL,
	[Description] [text] NULL,
	[Developer] [uniqueidentifier] NULL,
	[Publisher] [uniqueidentifier] NULL,
 CONSTRAINT [PK__Game__3214EC275D6CACF0] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[Game]  WITH CHECK ADD  CONSTRAINT [Game_Developer_ID_fk] FOREIGN KEY([Developer])
REFERENCES [dbo].[Developer] ([ID])
GO
ALTER TABLE [dbo].[Game] CHECK CONSTRAINT [Game_Developer_ID_fk]
GO
ALTER TABLE [dbo].[Game]  WITH CHECK ADD  CONSTRAINT [Game_Publisher_ID_fk] FOREIGN KEY([Publisher])
REFERENCES [dbo].[Publisher] ([ID])
GO
ALTER TABLE [dbo].[Game] CHECK CONSTRAINT [Game_Publisher_ID_fk]
GO
ALTER TABLE [dbo].[Game]  WITH CHECK ADD  CONSTRAINT [Valid_Price] CHECK  (([Price]>=(0)))
GO
ALTER TABLE [dbo].[Game] CHECK CONSTRAINT [Valid_Price]
GO
ALTER TABLE [dbo].[Game]  WITH CHECK ADD  CONSTRAINT [Valid_Sale] CHECK  (([Sale]>=(0) AND [Sale]<=(1)))
GO
ALTER TABLE [dbo].[Game] CHECK CONSTRAINT [Valid_Sale]
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Makes sure that the price of a game cannot be negative.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Game', @level2type=N'CONSTRAINT',@level2name=N'Valid_Price'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Checks to see if the sale is betwen 0 and 1, so no sale and 100% sale.' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'Game', @level2type=N'CONSTRAINT',@level2name=N'Valid_Sale'
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[HasTag](
	[GameID] [uniqueidentifier] NOT NULL,
	[TagID] [uniqueidentifier] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[GameID] ASC,
	[TagID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[HasTag]  WITH CHECK ADD  CONSTRAINT [FK__Has__GameID__14270015] FOREIGN KEY([GameID])
REFERENCES [dbo].[Game] ([ID])
GO
ALTER TABLE [dbo].[HasTag] CHECK CONSTRAINT [FK__Has__GameID__14270015]
GO
ALTER TABLE [dbo].[HasTag]  WITH CHECK ADD FOREIGN KEY([TagID])
REFERENCES [dbo].[Tag] ([ID])
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Review](
	[ID] [uniqueidentifier] NOT NULL,
	[Score] [bit] NOT NULL,
	[Date] [date] NOT NULL,
	[Content] [varchar](100) NOT NULL,
	[Game] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK__Review__3214EC2773B8EBAD] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Review]  WITH CHECK ADD  CONSTRAINT [FK__Review__Game__1DE57479] FOREIGN KEY([Game])
REFERENCES [dbo].[Game] ([ID])
GO
ALTER TABLE [dbo].[Review] CHECK CONSTRAINT [FK__Review__Game__1DE57479]
GO
ALTER TABLE [dbo].[Review]  WITH CHECK ADD  CONSTRAINT [CK__Review__Date__1ED998B2] CHECK  (([Date]<getdate()))
GO
ALTER TABLE [dbo].[Review] CHECK CONSTRAINT [CK__Review__Date__1ED998B2]
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FollowingDev](
	[Username] [varchar](20) NOT NULL,
	[DevID] [uniqueidentifier] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Username] ASC,
	[DevID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[FollowingDev]  WITH CHECK ADD  CONSTRAINT [FK__Following__DevID__55009F39] FOREIGN KEY([DevID])
REFERENCES [dbo].[Developer] ([ID])
GO
ALTER TABLE [dbo].[FollowingDev] CHECK CONSTRAINT [FK__Following__DevID__55009F39]
GO
ALTER TABLE [dbo].[FollowingDev]  WITH CHECK ADD FOREIGN KEY([Username])
REFERENCES [dbo].[Login] ([Username])
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FollowingGame](
	[Username] [varchar](20) NOT NULL,
	[GameID] [uniqueidentifier] NOT NULL,
 CONSTRAINT [Favorites_pk] PRIMARY KEY NONCLUSTERED 
(
	[Username] ASC,
	[GameID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[FollowingGame]  WITH CHECK ADD  CONSTRAINT [Favorites_Game_ID_fk] FOREIGN KEY([GameID])
REFERENCES [dbo].[Game] ([ID])
GO
ALTER TABLE [dbo].[FollowingGame] CHECK CONSTRAINT [Favorites_Game_ID_fk]
GO
ALTER TABLE [dbo].[FollowingGame]  WITH CHECK ADD  CONSTRAINT [Favorites_Login_Username_fk] FOREIGN KEY([Username])
REFERENCES [dbo].[Login] ([Username])
GO
ALTER TABLE [dbo].[FollowingGame] CHECK CONSTRAINT [Favorites_Login_Username_fk]
GO



----------------------------------------------------------------------------------------------------------
------------------------------------------------INDEX CREATION--------------------------------------------
----------------------------------------------------------------------------------------------------------

SET ANSI_PADDING ON
GO

CREATE UNIQUE NONCLUSTERED INDEX [SX_TagName] ON [dbo].[Tag]
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

CREATE NONCLUSTERED INDEX [SX_ReviewGame] ON [dbo].[Review]
(
	[Game] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

CREATE UNIQUE NONCLUSTERED INDEX [SX_PublisherName] ON [dbo].[Publisher]
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

CREATE UNIQUE NONCLUSTERED INDEX [SX_GameTitle] ON [dbo].[Game]
(
	[Title] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

CREATE UNIQUE NONCLUSTERED INDEX [SX_DeveloperName] ON [dbo].[Developer]
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO



----------------------------------------------------------------------------------------------------------
------------------------------------------------VIEW CREATION---------------------------------------------
----------------------------------------------------------------------------------------------------------

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[DeveloperData]
AS
SELECT d.ID AS ID, d.[Name] AS [Name], d.[Address] AS [Address], count(g.Title) AS [Games]
FROM Game g
JOIN Developer d on g.Developer = d.ID
GROUP BY d.[Name], d.[Address], d.ID
ORDER BY d.[Name] asc OFFSET 0 ROWS
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[DevelopersAlphabetical]
AS
SELECT * FROM Developer
ORDER BY Developer.Name ASC
OFFSET 0 ROWS
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[ExportGamesView]
AS
SELECT 
	g.Title AS GameTitle,
	g.Price AS GamePrice,
	g.Sale  AS GameSale,
	g.Release AS GameRelease,
	g.[Description] AS GameDescription,
	d.[Name] AS DevName,
	d.[Address] AS DevAddress,
	p.[Name] AS PubName,
	l.StartDate AS LicenseStart,
	l.EndDate AS LicenseEnd,
	t.[Name] AS Tag,
	r.Score AS ReviewScore,
	r.[Date] AS ReviewDate,
	r.Content AS ReviewContent
FROM Game g
FULL OUTER JOIN Developer d on d.ID = g.Developer
FULL OUTER JOIN Publisher p on p.ID = g.Publisher
FULL OUTER JOIN HasTag h on h.GameID = g.ID
FULL OUTER JOIN Tag t on t.ID = h.TagID
FULL OUTER JOIN Review r on r.Game = g.ID
FULL OUTER JOIN License l on l.ID = p.LicenseID
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[ExportLoginView]
AS
SELECT 
	l.Username AS Username,
	l.[Password] AS [Password],
	l.Salt AS Salt,
	l.[Admin] AS [Admin],
	d.[Name] AS FollowDeveloper,
	g.[Title] AS FollowGame
FROM [Login] l
LEFT OUTER JOIN FollowingDev fd on fd.Username = l.Username
LEFT OUTER JOIN FollowingGame fg on fg.Username = l.Username
LEFT OUTER JOIN Developer d on d.ID = fd.DevID
LEFT OUTER JOIN Game g on g.ID = fg.GameID
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[GamesAlphabetical]
AS
SELECT * FROM Game
ORDER BY Game.Title ASC 
OFFSET 0 ROWS
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[GamesWithRatings]
AS
WITH 
	upvotes  (Game, Score) as (SELECT Review.Game, count(Review.Score) FROM Review WHERE Review.Score = 1 GROUP BY Review.Game),
	allvotes (Game, Score) as (SELECT Review.Game, count(Review.Score) FROM Review GROUP BY Review.Game)
SELECT u.Game, (((u.Score+1)*100)/(a.Score + 1)) AS Score
FROM upvotes u
JOIN allvotes a on u.Game = a.Game
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[PublishersAlphabetical]
AS
SELECT * FROM Publisher
ORDER BY Publisher.Name
OFFSET 0 ROWS
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[TagsAlphabetical]
AS
SELECT * FROM Tag
ORDER BY Tag.Name
OFFSET 0 ROWS
GO


-----------------------------------------------------------------------------------------------------------
--STORED PROCEDURE CREATION
-----------------------------------------------------------------------------------------------------------

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[addTagToGame](
	@Tag_1	varchar(20),
	@Game_2 varchar(35)
	)
AS
--check for nulls
IF(@Tag_1 is null)
BEGIN
	print('Tag cannot be null.')
	RETURN 1
END
IF(@Game_2 is null)
BEGIN
	print('Game cannot be null.')
	RETURN 1
END
--find IDs for tag and game
DECLARE @TagID uniqueidentifier
DECLARE @GameID uniqueidentifier
SELECT @TagID = ID FROM Tag WHERE Tag.Name = @Tag_1
SELECT @GameID = ID FROM Game WHERE Game.Title = @Game_2
--see if game and tag exist in database
IF(@TagID is null)
BEGIN
	print('This tag does not exist.')
	RETURN 2
END
IF(@GameID is null)
BEGIN
	print('This game does not exist.')
	RETURN 2
END
-- Test to see if that combination already exists in the table
IF(EXISTS(SELECT * FROM HasTag WHERE TagID = @TagID AND GameID = @GameID))
BEGIN
	PRINT('This combination already exists in the table.')
	RETURN 3
END
ELSE
BEGIN
INSERT INTO HasTag(GameID, TagID)
VALUES(@GameID, @TagID)
END
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[addUserLogin](
	@Username_1	varchar(20),
	@Password_2	char(64),
	@Salt_3		char(32),
	@Admin_4	smallint
	)
AS
--check nulls
IF(@Username_1 is null)
BEGIN
	print('Username cannot be null')
	RETURN 1
END
IF(@Password_2 is null)
BEGIN
	print('Password cannot be null')
	RETURN 1
END
IF(@Salt_3 is null)
BEGIN
	print('Salt cannot be null')
	RETURN 1
END
IF(@Admin_4 is null)
BEGIN
	print('Admin cannot be null')
	RETURN 1
END
--check for duplicates
IF(exists (SELECT * FROM [Login] WHERE [Login].Username = @Username_1))
BEGIN
	print('Username is already taken.')
	RETURN 3
END
ELSE
BEGIN
--insert
INSERT INTO [Login](Username, Password, Salt, [Admin])
VALUES(@Username_1, @Password_2, @Salt_3, @Admin_4)
END
GO




SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[createDeveloper](
	@Name_1 varchar(40),
	@Address_2 varchar(80) = null
)
AS
IF(@Name_1 is NULL)
BEGIN
	print('The name cannot be null.')
	RETURN 1 
END
IF(exists(SELECT * FROM Developer WHERE Developer.[Name] = @Name_1))
BEGIN
	print('That developer already exists in the Developer table.')
	RETURN 2
END
INSERT INTO Developer (ID, Name, Address)
VALUES (newID(), @Name_1, @Address_2)
RETURN 0
GO


SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[createGame](
	@Name_1 varchar(35),
	@Price_2 money,
	@Sale_3 real = 0.00,
	@ReleaseDate_4 varchar(10), -- = convert (date , getDate()),
	@Description text = null
)
AS
--check nulls
IF(@Name_1 is null)
BEGIN
	print('Name cannot be null')
	RETURN 1
END
IF(@Price_2 is null)
BEGIN
	print('Price cannot be null')
	RETURN 1
END
IF(@ReleaseDate_4 is null)
BEGIN
	print('Release date cannot be null')
	RETURN 1
END
--check for duplicate data
IF(exists(SELECT * FROM Game WHERE Game.Title = @Name_1))
BEGIN
	print('That game already exists in Game table')
	RETURN 2
END
INSERT INTO Game (ID, Title, Price, Sale, Release, [Description])
VALUES (newID(), @Name_1, @Price_2, @Sale_3, convert(date, @ReleaseDate_4), @Description)
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[createLicense](
	@StartDate_1		date,
	@ExpirationDate_2	date,
	@LicenseID_3		uniqueidentifier OUTPUT
)
AS
--check for nulls
Set @LicenseID_3 = NEWID()
IF(@StartDate_1 is null)
BEGIN
	print('Start date cannot be null.')
	RETURN 1
END
IF(@ExpirationDate_2 is null)
BEGIN
	print('Expiration date cannot be null.')
	RETURN 2
END
INSERT INTO License (ID, StartDate, EndDate)
VALUES (@LicenseID_3, @StartDate_1, @ExpirationDate_2)
RETURN 0
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[createPublisher](
	@Name_1 varchar(40)
)
AS
IF(@Name_1 is NULL)
BEGIN
	print('The name cannot be null.')
	RETURN 1 
END
-- Check if someone else already has claim to the publisher liscence
IF(exists(SELECT * FROM Publisher WHERE Publisher.Name = @Name_1))
BEGIN
	print('That publisher already exists in the Publisher table.')
	RETURN 2
END
INSERT INTO Publisher(ID, Name, LicenseID)
VALUES (newID(), @Name_1, null)
RETURN 0
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[createReview](
	@Score_1	bit,
	@Date_2		varchar(20),
	@Content_3	varchar(100),
	@Game_4		varchar(35)
	)
AS
--check nulls
IF(@Score_1 is null)
BEGIN
	print('Score cannot be null')
	RETURN 1
END
IF(@Date_2 is null)
BEGIN
	print('Date cannot be null')
	RETURN 1
END
IF(@Content_3 is null)
BEGIN
	print('Content cannot be null')
	RETURN 1
END
IF(@Game_4 is null)
BEGIN
	print('Game cannot be null')
	RETURN 1
END
--find gameID
DECLARE @GameID uniqueidentifier
SELECT @GameID = ID FROM Game WHERE Game.Title = @Game_4
IF(@GameID is null)
BEGIN
	print('This game does not exist')
	RETURN 2
END
INSERT INTO Review(ID, Score, Date, Content, Game)
VALUES(newid(), @Score_1, convert(date, @Date_2), @Content_3, @GameID)
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[createTag](
	@Name_1 varchar(20)
)
as
IF(@Name_1 is null)
BEGIN
	print('The name cannot be null.')
	RETURN 1
END
if(exists(Select * from Tag where Tag.Name = @Name_1))
Begin
	print('That tag already exists in the Tags table.')
	RETURN 2
End
Else
Begin
INSERT INTO Tag (ID, Name)
VALUES (NEWID(), @Name_1)
return 0
End
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[followDev](
	@User_1 varchar(20),
	@Dev_2 varchar(40)
)
AS
IF(@User_1 is NULL)
BEGIN
	print('The name cannot be null.')
	RETURN 1 
END
IF(@Dev_2 is NULL)
BEGIN
	print('The developer cannot be null.')
	RETURN 1
END
IF(not exists(SELECT * FROM [Login] WHERE [Login].Username = @User_1))
BEGIN
	print('This user does not exist.')
	RETURN 2
END
DECLARE @DevID UniqueIdentifier
SELECT @DevID = Developer.ID FROM Developer WHERE Developer.[Name] = @Dev_2
IF(@DevID is null)
BEGIN
	print('This game does not exist')
	RETURN 2
END
IF(exists(SELECT * FROM FollowingDev WHERE FollowingDev.Username = @User_1 and FollowingDev.DevID = @DevID))
BEGIN
	print('This user already follows this developer.')
	RETURN 3
END
INSERT INTO FollowingGame(Username, GameID)
VALUES (@User_1, @DevID)
RETURN 0
GO


SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROC [dbo].[followDevID](
	@User_1 varchar(20),
	@Dev_2 uniqueidentifier
)
AS
IF(@User_1 is NULL)
BEGIN
	print('The name cannot be null.')
	RETURN 1 
END
IF(@Dev_2 is NULL)
BEGIN
	print('The developer cannot be null.')
	RETURN 1
END
IF(not exists(SELECT * FROM [Login] WHERE [Login].Username = @User_1))
BEGIN
	print('This user does not exist.')
	RETURN 2
END
IF(exists(SELECT * FROM FollowingDev WHERE FollowingDev.Username = @User_1 and FollowingDev.DevID = @Dev_2))
BEGIN
	print('This user already follows this developer.')
	RETURN 3
END
INSERT INTO FollowingDev(Username, DevID)
VALUES (@User_1, @Dev_2)
RETURN 0
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[followGame](
	@User_1 varchar(20),
	@Game_2 varchar(35)
)
AS
IF(@User_1 is NULL)
BEGIN
	print('The name cannot be null.')
	RETURN 1 
END
IF(@Game_2 is NULL)
BEGIN
	print('The game cannot be null.')
	RETURN 1
END
IF(not exists(SELECT * FROM [Login] WHERE [Login].Username = @User_1))
BEGIN
	print('This user does not exist.')
	RETURN 2
END
DECLARE @GameID UniqueIdentifier
SELECT @GameID = Game.ID FROM Game WHERE Game.Title = @Game_2
IF(@GameID is null)
BEGIN
	print('This game does not exist')
	RETURN 2
END
IF(exists(SELECT * FROM FollowingGame WHERE FollowingGame.Username = @User_1 and FollowingGame.GameID = @GameID))
BEGIN
	print('This user already follows this game.')
	RETURN 3
END
INSERT INTO FollowingGame(Username, GameID)
VALUES (@User_1, @GameID)
RETURN 0
GO


SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROC [dbo].[followGameID](
	@User_1 varchar(20),
	@Game_2 uniqueidentifier
)
AS
IF(@User_1 is NULL)
BEGIN
	print('The name cannot be null.')
	RETURN 1 
END
IF(@Game_2 is NULL)
BEGIN
	print('The game cannot be null.')
	RETURN 1
END
IF(not exists(SELECT * FROM [Login] WHERE [Login].Username = @User_1))
BEGIN
	print('This user does not exist.')
	RETURN 2
END
IF(exists(SELECT * FROM FollowingGame WHERE FollowingGame.Username = @User_1 and FollowingGame.GameID = @Game_2))
BEGIN
	print('This user already follows this game.')
	RETURN 3
END
INSERT INTO FollowingGame(Username, GameID)
VALUES (@User_1, @Game_2)
RETURN 0
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[getReviewRate](
	@Game_1 uniqueidentifier
	)
AS
--check null
IF(@Game_1 is null)
BEGIN 
	print('Game cannot be null')
	RETURN -1
END
DECLARE @GameID uniqueidentifier
SELECT @GameID = ID FROM Game WHERE Game.ID = @Game_1

IF(@GameID is null)
BEGIN
	print('This game does not exist.')
	RETURN -2
END
DECLARE @Upvotes int, @Allvotes int, @Result int
SELECT @Upvotes = count(Score) FROM Review WHERE Review.Game = @GameID and Review.Score = 1
SELECT @Allvotes = count(Score) FROM Review WHERE Review.Game = @GameID
IF(@Allvotes = 0) RETURN 0
RETURN (@Upvotes*100) / (@Allvotes)
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[updatePublisherLicense](
	@Publisher_1	varchar(40),
	@StartDate_2	varchar(20),
	@EndDate_3		varchar(20)
	)
AS
IF(@Publisher_1 is null)
BEGIN
	print('Publisher cannot be null')
	RETURN 1
END
IF(not (exists (SELECT * FROM Publisher WHERE Publisher.Name = @Publisher_1)))
BEGIN
	print('Publisher does not exist')
	RETURN 2
END
DECLARE @ERROR int
DECLARE @LicenseID uniqueidentifier
DECLARE @Start date, @End date
SET @Start = convert(date, @StartDate_2)
SET @End = convert(date, @EndDate_3)
EXEC @ERROR = createLicense @StartDate_1 = @Start, @ExpirationDate_2 = @End, @LicenseID_3 = @LicenseID output
IF(not(@ERROR = 0))
BEGIN
	print('Start and End dates cannot be null')
	RETURN 1
END
DECLARE @OldLicense uniqueidentifier
SELECT * FROM Publisher WHERE Publisher.Name = @Publisher_1
UPDATE Publisher
	SET LicenseID = @LicenseID
	WHERE Publisher.Name = @Publisher_1

IF(not (@OldLicense is null))
BEGIN
	DELETE FROM License WHERE License.ID = @OldLicense
END
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[setDevPubForGame](
    @Game_1			varchar(35),
    @Developer_2	varchar(40) = null,
    @Publisher_3	varchar(40) = null
)
AS
IF(@Game_1 is null)
BEGIN
	print('This game does not exist.')
	RETURN 1
END
DECLARE @devID AS uniqueidentifier, @pubID AS uniqueidentifier
IF((not (@Publisher_3 is null)))
BEGIN
	SELECT @pubID = ID FROM Publisher WHERE Name = @Publisher_3
	UPDATE Game
		SET Publisher = @pubID
		WHERE Title = @Game_1
END
IF((not(@Developer_2 is null)))
BEGIN 
	SELECT @devID = ID FROM Developer WHERE Name = @Developer_2
	UPDATE Game
		SET Developer = @devID
		WHERE Title = @Game_1
END
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[importGameData](
	@GameTitle			varchar(30),
	@GamePrice			money,
	@GameSale			real,
	@GameRelease		date,
	@GameDescription	text,
	@DevName			varchar(40),
	@DevAddress			varchar(80),
	@PubName			varchar(40),
	@LicenseStart		date,
	@LicenseEnd			date,
	@Tag				varchar(20),
	@ReviewScore		bit,
	@ReviewDate			date,
	@ReviewContent		varchar(100)
	)
AS
--create and catch game and ID
EXEC createGame @GameTitle, @GamePrice, @GameSale, @GameRelease, @GameDescription
DECLARE @GameID uniqueidentifier
SELECT @GameID = ID FROM Game WHERE Game.Title = @GameTitle
--create developer and ID
EXEC createDeveloper @DevName, @DevAddress
DECLARE @DevID uniqueidentifier
SELECT @DevID = ID FROM Developer WHERE Developer.Name = @DevName
--create publisher
EXEC createPublisher @PubName
--add dev and pub to game
IF(exists(SELECT * FROM Game WHERE Game.Title = @GameTitle and (Developer is null or Publisher is null)))
BEGIN
	EXEC setDevPubForGame @GameTitle, @DevName, @PubName
END
--add license to publisher
IF(exists(SELECT * FROM Publisher WHERE Publisher.Name = @PubName and Publisher.LicenseID is null))
BEGIN
	EXEC updatePublisherLicense @PubName, @LicenseStart, @LicenseEnd
END
--create tag
EXEC createTag @Tag
--add tag to game
EXEC addTagToGame @Tag, @GameTitle
--create review if it doesn't exist
IF(not (exists (SELECT * FROM Review WHERE Review.Game = @GameID and Review.Content = @ReviewContent)))
BEGIN
EXEC createReview @ReviewScore, @ReviewDate, @ReviewContent, @GameTitle
END
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[importLoginData](
	@Username	varchar(20),
	@Password	char(64),
	@Salt		char(32),
	@Admin		smallint,
	@FollowDev	varchar(40),
	@FollowGame varchar(30)
	)
AS
IF((@Username is null) or (@Password is null) or (@Salt is null))
BEGIN
	print('Invalid data line')
	RETURN 1
END
EXEC addUserLogin @Username_1 = @Username, @Password_2 = @Password, @Salt_3 = @Salt, @Admin_4 = @Admin
BEGIN
	EXEC followDev @User_1 = @Username, @Dev_2 = @FollowDev
END
BEGIN
	EXEC followGame @User_1 = @Username, @Game_2 = @FollowGame
END
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[unfollowDev](
	@User_1 varchar(20),
	@Dev_2 varchar(40)
)
AS
IF(@User_1 is NULL)
BEGIN
	print('The name cannot be null.')
	RETURN 1 
END
IF(@Dev_2 is NULL)
BEGIN
	print('The developer cannot be null.')
	RETURN 1
END
IF(not exists(SELECT * FROM [Login] WHERE [Login].Username = @User_1))
BEGIN
	print('This user does not exist.')
	RETURN 2
END
DECLARE @DevID UniqueIdentifier
SELECT @DevID = Developer.ID FROM Developer WHERE Developer.[Name] = @Dev_2
IF(@DevID is null)
BEGIN
	print('This game does not exist')
	RETURN 2
END
IF(not exists(SELECT * FROM FollowingDev WHERE FollowingDev.Username = @User_1 and FollowingDev.DevID = @DevID))
BEGIN
	print('This user does not follow this developer.')
	RETURN 3
END
DELETE FROM FollowingDev
WHERE FollowingDev.DevID = @DevID and FollowingDev.Username = @User_1
RETURN 0
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[unfollowDevID](
	@User_1 varchar(20),
	@Dev_2 uniqueidentifier
)
AS
IF(@User_1 is NULL)
BEGIN
	print('The name cannot be null.')
	RETURN 1 
END
IF(@Dev_2 is NULL)
BEGIN
	print('The developer cannot be null.')
	RETURN 1
END
IF(not exists(SELECT * FROM [Login] WHERE [Login].Username = @User_1))
BEGIN
	print('This user does not exist.')
	RETURN 2
END
IF(not exists(SELECT * FROM FollowingDev WHERE FollowingDev.Username = @User_1 and FollowingDev.DevID = @Dev_2))
BEGIN
	print('This user does not follow this developer.')
	RETURN 3
END
DELETE FROM FollowingDev
WHERE FollowingDev.DevID = @Dev_2 and FollowingDev.Username = @User_1
RETURN 0
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[unfollowGame](
	@User_1 varchar(20),
	@Game_2 varchar(35)
)
AS
IF(@User_1 is NULL)
BEGIN
	print('The name cannot be null.')
	RETURN 1 
END
IF(@Game_2 is NULL)
BEGIN
	print('The game cannot be null.')
	RETURN 1
END
IF(not exists(SELECT * FROM [Login] WHERE [Login].Username = @User_1))
BEGIN
	print('This user does not exist.')
	RETURN 2
END
DECLARE @GameID UniqueIdentifier
SELECT @GameID = Developer.ID FROM Developer WHERE Developer.[Name] = @Game_2
IF(@GameID is null)
BEGIN
	print('This game does not exist')
	RETURN 2
END
IF(not exists(SELECT * FROM FollowingGame WHERE FollowingGame.Username = @User_1 and FollowingGame.GameID = @GameID))
BEGIN
	print('This user does not follow this game.')
	RETURN 3
END
DELETE FROM FollowingGame
WHERE FollowingGame.GameID = @GameID and FollowingGame.Username = @User_1
RETURN 0
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[unfollowGameID](
	@User_1 varchar(20),
	@Game_2 uniqueidentifier
)
AS
IF(@User_1 is NULL)
BEGIN
	print('The name cannot be null.')
	RETURN 1 
END
IF(@Game_2 is NULL)
BEGIN
	print('The game cannot be null.')
	RETURN 1
END
IF(not exists(SELECT * FROM [Login] WHERE [Login].Username = @User_1))
BEGIN
	print('This user does not exist.')
	RETURN 2
END
IF(not exists(SELECT * FROM FollowingGame WHERE FollowingGame.Username = @User_1 and FollowingGame.GameID = @Game_2))
BEGIN
	print('This user does not follow this game.')
	RETURN 3
END
DELETE FROM FollowingGame
WHERE FollowingGame.GameID = @Game_2 and FollowingGame.Username = @User_1
RETURN 0
GO


--USER CREATION
IF(not (SYSTEM_USER = 'andersc7'))
BEGIN
	CREATE USER [andersc7] FOR LOGIN [andersc7] WITH DEFAULT_SCHEMA=[dbo]
	exec sp_addrolemember 'db_owner', 'andersc7'
END

IF(not (SYSTEM_USER = 'buccelgt'))
BEGIN
	CREATE USER [buccelgt] FOR LOGIN [buccelgt] WITH DEFAULT_SCHEMA=[dbo]
	exec sp_addrolemember 'db_owner', 'buccelgt'
END

IF(not (SYSTEM_USER = 'petersjl'))
BEGIN
	CREATE USER [petersjl] FOR LOGIN [petersjl] WITH DEFAULT_SCHEMA=[dbo]
	exec sp_addrolemember 'db_owner', 'petersjl'
END

CREATE USER [SGCUser] FOR LOGIN [SGCUser] WITH DEFAULT_SCHEMA=[db_datareader]

Create role db_executor
grant execute to db_executor

exec sp_addrolemember 'db_datareader', 'SGCUser'
exec sp_addrolemember 'db_datawriter', 'SGCUser'
exec sp_addrolemember 'db_executor', 'SGCUser'


print('')
print('-----------------------------')
print('Successfully created database')
print('-----------------------------')
print('')
print('Adding admin user to database...')
print('')

EXEC	[dbo].addUserLogin
		@Username_1 = N'admin',
		@Password_2 = N'cf484013dabb6d72c52f720f1334061bc969bf07ec0d0b53891b906c4dd3348c',
		@Salt_3 = N'f13d3d197471974e473e778637c23e92',
		@Admin_4 = 1

print('')
print('-------------------------------------')
print('Successfully added admin to database.')
print('-------------------------------------')