<?php
namespace Grav\Theme;

use Grav\Common\Data\Blueprints;
use Grav\Common\Theme;
use Grav\Common\Utils;
use RocketTheme\Toolbox\Event\Event;

class Loki extends Theme
{   
   // Access plugin events in this class
   public static function getSubscribedEvents()
   {
      return [
         'onBlueprintCreated' => ['onBlueprintCreated', 0],
         'onAdminCreatePageFrontmatter' => ['onAdminCreatePageFrontmatter', 0],
         'onAdminSave' => ['onAdminSave', 0]
      ];
   }
   
   /**
   * Remove any page from collection with post_featured: false|0
   *
   * @param Event $event
   */
   public function featuredPosts(Event $event): void
   {
      /** @var Collection $collection */
      $collection = $event['collection'];
      $featured_collection = $collection->order('date', 'desc');
      
      foreach ($collection as $item) {
         $post_featured = $item->header()->post_featured ?? true;
         if ((bool) $post_featured === false) {
            $collection->remove($item->path());
         }
      }
      
   }
   
   public function onAdminCreatePageFrontmatter(Event $event)
   {
      $header = $event['header'];
      
      if(substr($event['data']['name'], 0, 5) == 'entry' && !isset($header['date'])){
         $header['visible'] = 1;
         $header['date'] = date($this->grav['config']->get('system.pages.dateformat.default', 'H:i d-m-Y'));
         $event['header'] = $header;
      }
      
   }
   
   public function onAdminSave(Event $event){
      
   }
   
   public function onBlueprintCreated(Event $event)
   {
      $newtype = $event['type'];
      
      if (0 === strpos($newtype, 'modular/')) {
      } else {
         $blueprint = $event['blueprint'];
         if ($blueprint->get('form/fields/tabs', null, '/')) {
            
            $blueprints = new Blueprints(__DIR__ . '/blueprints/extended/');
            $extends = $blueprints->get('options');
            $blueprint->extend($extends, true);
            
         }
      }
      
      $blueprint = $event['blueprint'];
      if ($blueprint->get('form/fields/tabs', null, '/')) {
         
         $blueprints = new Blueprints(__DIR__ . '/blueprints/extended/');
         $extends = $blueprints->get('advanced');
         $blueprint->extend($extends, true);
         
      }
      
   }
}
